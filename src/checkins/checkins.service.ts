import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { DynamicCheckInDto } from './dto/dynamic-checkin.dto';
import { calculateDistance } from '../common/utils/geo.util';
import { ConfigService } from '@nestjs/config';
import { DynamicQrService } from '../dynamic-qr/dynamic-qr.service';
import { QrType } from '@prisma/client';

@Injectable()
export class CheckinsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private dynamicQrService: DynamicQrService,
  ) {}

  async create(createCheckInDto: CreateCheckInDto) {
    const { placeId, latitude, longitude, userId, phone } = createCheckInDto;

    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
    });
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

    return this.prisma.checkIn.create({
      data: {
        ...createCheckInDto,
        qrType: QrType.STATIC,
        isGuest,
      },
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

    return this.prisma.checkIn.create({
      data: {
        placeId,
        userId,
        deviceInfo,
        phone,
        qrType: QrType.DYNAMIC,
        isGuest,
      },
    });
  }

  async findAllByPlace(placeId: string) {
    return this.prisma.checkIn.findMany({
      where: { placeId },
      include: {
        user: {
          select: { id: true, fullName: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
