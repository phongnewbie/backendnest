import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { QrType } from '@prisma/client';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { DynamicCheckInDto } from './dto/dynamic-checkin.dto';
import { GetCheckinsDto } from './dto/get-checkins.dto';
import { GetMyCheckinsDto } from './dto/get-my-checkins.dto';
import { calculateDistance } from '../common/utils/geo.util';
import { ConfigService } from '@nestjs/config';
import { DynamicQrService } from '../dynamic-qr/dynamic-qr.service';
import type { ICheckinsRepository } from './checkins.repository.interface';
import type { IPlacesRepository } from '../places/places.repository.interface';
import type { IUsersRepository } from '../auth/users.repository.interface';

@Injectable()
export class CheckinsService {
  constructor(
    private configService: ConfigService,
    private dynamicQrService: DynamicQrService,
    @Inject('ICHECKINS_REPOSITORY')
    private readonly checkinsRepository: ICheckinsRepository,
    @Inject('IPLACES_REPOSITORY')
    private readonly placesRepository: IPlacesRepository,
    @Inject('IUSERS_REPOSITORY')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(createCheckInDto: CreateCheckInDto, userId: string | null) {
    const { placeId, latitude, longitude, phone } = createCheckInDto;

    const place = await this.placesRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Địa điểm không tồn tại.');
    }

    // 1. GPS Validation
    if (latitude && longitude) {
      const distance = calculateDistance(
        place.latitude,
        place.longitude,
        latitude,
        longitude,
      );
      const MAX_DISTANCE =
        place.checkInRadius ??
        this.configService.get<number>('MAX_CHECKIN_DISTANCE') ??
        500;

      if (distance > MAX_DISTANCE) {
        throw new BadRequestException(
          `Bạn đang ở quá xa địa điểm này (${Math.round(distance)}m). Giới hạn cho phép là ${MAX_DISTANCE}m.`,
        );
      }
    }

    // 2. Resolve identity for daily check-in rule
    let targetPhone = phone;
    if (userId) {
      const user = await this.usersRepository.findById(userId);
      if (user) {
        targetPhone = user.phone;
      }
    }

    if (!userId && !targetPhone) {
      throw new BadRequestException(
        'Người dùng vãng lai bắt buộc cung cấp số điện thoại.',
      );
    }

    // 3. Daily check-in rule (One check-in per user/phone per place per day)
    const today = new Date();
    const startDate = new Date(today.setHours(0, 0, 0, 0));
    const endDate = new Date(today.setHours(23, 59, 59, 999));

    const checkInCount = await this.checkinsRepository.countDailyCheckIn({
      placeId,
      userId,
      phone: targetPhone,
      startDate,
      endDate,
    });

    if (checkInCount > 0) {
      throw new BadRequestException(
        'Bạn đã check-in tại địa điểm này trong hôm nay.',
      );
    }

    return this.checkinsRepository.create({
      ...createCheckInDto,
      userId,
      phone: targetPhone,
      qrType: QrType.STATIC,
      isGuest: !userId,
    });
  }

  async createDynamic(
    dynamicCheckInDto: DynamicCheckInDto,
    userId: string | null,
  ) {
    const { token, deviceInfo, phone } = dynamicCheckInDto;

    const placeId = this.dynamicQrService.verifyToken(token);
    if (!placeId) {
      throw new BadRequestException(
        'Mã QR động không hợp lệ hoặc đã hết hạn. Vui lòng quét lại mã mới.',
      );
    }

    const isGuest = !userId;
    if (isGuest && !phone) {
      throw new BadRequestException(
        'Người dùng vãng lai bắt buộc cung cấp số điện thoại.',
      );
    }

    return this.checkinsRepository.create({
      placeId,
      userId,
      deviceInfo,
      phone,
      qrType: QrType.DYNAMIC,
      isGuest,
    });
  }

  async findPaginated(query: GetCheckinsDto) {
    const { placeId, cursor, limit = 10 } = query;

    const checkins = await this.checkinsRepository.findPaginated({
      placeId,
      cursor,
      limit: limit + 1,
    });

    const hasNextPage = checkins.length > limit;
    const data = hasNextPage ? checkins.slice(0, limit) : checkins;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return { data, meta: { nextCursor, hasNextPage, limit } };
  }

  async findMyCheckins(userId: string, query: GetMyCheckinsDto) {
    const { cursor, limit = 10, from, to } = query;

    const checkins = await this.checkinsRepository.findPaginatedByUser({
      userId,
      cursor,
      limit: limit + 1,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(new Date(to).setHours(23, 59, 59, 999)) : undefined,
    });

    const hasNextPage = checkins.length > limit;
    const data = hasNextPage ? checkins.slice(0, limit) : checkins;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return { data, meta: { nextCursor, hasNextPage, limit } };
  }

  async findAllByPlace(placeId: string) {
    return this.checkinsRepository.findAllByPlace(placeId);
  }
}
