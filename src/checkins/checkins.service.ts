import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { QrType } from '@prisma/client';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { DynamicCheckInDto } from './dto/dynamic-checkin.dto';
import { calculateDistance } from '../common/utils/geo.util';
import { ConfigService } from '@nestjs/config';
import { DynamicQrService } from '../dynamic-qr/dynamic-qr.service';
import type { ICheckinsRepository } from './checkins.repository.interface';
import type { IPlacesRepository } from '../places/places.repository.interface';

@Injectable()
export class CheckinsService {
  constructor(
    private configService: ConfigService,
    private dynamicQrService: DynamicQrService,
    @Inject('ICHECKINS_REPOSITORY')
    private readonly checkinsRepository: ICheckinsRepository,
    @Inject('IPLACES_REPOSITORY')
    private readonly placesRepository: IPlacesRepository,
  ) {}

  async create(createCheckInDto: CreateCheckInDto) {
    const { placeId, latitude, longitude, userId, phone } = createCheckInDto;

    const place = await this.placesRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Địa điểm không tồn tại.');
    }

    // GPS Validation (Static QR rule)
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

    const isGuest = !userId;
    if (isGuest && !phone) {
      throw new BadRequestException(
        'Người dùng vãng lai bắt buộc cung cấp số điện thoại.',
      );
    }

    return this.checkinsRepository.create({
      ...createCheckInDto,
      qrType: QrType.STATIC,
      isGuest,
    });
  }

  async createDynamic(dynamicCheckInDto: DynamicCheckInDto) {
    const { token, userId, deviceInfo, phone } = dynamicCheckInDto;

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

  async findAllByPlace(placeId: string) {
    return this.checkinsRepository.findAllByPlace(placeId);
  }
}
