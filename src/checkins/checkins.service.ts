import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { mockDb, QrType } from '../common/mock-data';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { DynamicCheckInDto } from './dto/dynamic-checkin.dto';
import { calculateDistance } from '../common/utils/geo.util';
import { ConfigService } from '@nestjs/config';
import { DynamicQrService } from '../dynamic-qr/dynamic-qr.service';

@Injectable()
export class CheckinsService {
  constructor(
    private configService: ConfigService,
    private dynamicQrService: DynamicQrService,
  ) {}

  create(createCheckInDto: CreateCheckInDto) {
    const { placeId, latitude, longitude, userId, phone } = createCheckInDto;

    const place = mockDb.places.find((p) => p.id === placeId);
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
        this.configService.get<number>('MAX_CHECKIN_DISTANCE') || 500;

      if (distance > MAX_DISTANCE) {
        throw new BadRequestException(
          `Bạn đang ở quá xa địa điểm này (${Math.round(distance)}m). Giới hạn là ${MAX_DISTANCE}m.`,
        );
      }
    }

    const isGuest = !userId;
    if (isGuest && !phone) {
      throw new BadRequestException(
        'Người dùng vãng lai bắt buộc cung cấp số điện thoại.',
      );
    }

    const checkin = {
      ...createCheckInDto,
      id: mockDb.generateId(),
      qrType: QrType.STATIC,
      isGuest,
      createdAt: new Date(),
    };
    mockDb.checkins.push(checkin);
    return checkin;
  }

  createDynamic(dynamicCheckInDto: DynamicCheckInDto) {
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

    const checkin = {
      id: mockDb.generateId(),
      placeId,
      userId,
      deviceInfo,
      phone,
      qrType: QrType.DYNAMIC,
      isGuest,
      createdAt: new Date(),
    };
    mockDb.checkins.push(checkin);
    return checkin;
  }

  findAllByPlace(placeId: string) {
    return mockDb.checkins
      .filter((c) => c.placeId === placeId)
      .map((c) => ({
        ...c,
        user: mockDb.users
          .filter((u) => u.id === c.userId)
          .map((u) => ({ id: u.id, fullName: u.fullName, phone: u.phone }))[0],
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
