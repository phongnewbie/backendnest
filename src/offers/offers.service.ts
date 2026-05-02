import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOfferDto: CreateOfferDto) {
    const place = await this.prisma.place.findUnique({
      where: { id: createOfferDto.placeId },
    });
    if (!place) {
      throw new NotFoundException('Địa điểm không tồn tại');
    }

    if (
      new Date(createOfferDto.validFrom) >= new Date(createOfferDto.validTo)
    ) {
      throw new BadRequestException(
        'Thời gian bắt đầu phải trước thời gian kết thúc',
      );
    }

    return this.prisma.offer.create({
      data: createOfferDto,
    });
  }

  async findAllByPlace(placeId: string) {
    return this.prisma.offer.findMany({
      where: {
        placeId,
        validTo: { gte: new Date() }, // Only return valid offers
      },
      orderBy: { validFrom: 'asc' },
    });
  }

  async saveOffer(userId: string, offerId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (!offer) throw new NotFoundException('Ưu đãi không tồn tại');
    if (new Date(offer.validTo) < new Date())
      throw new BadRequestException('Ưu đãi đã hết hạn');

    const existing = await this.prisma.userOffer.findUnique({
      where: { userId_offerId: { userId, offerId } },
    });

    if (existing) {
      throw new BadRequestException('Bạn đã lưu ưu đãi này rồi');
    }

    return this.prisma.userOffer.create({
      data: { userId, offerId },
    });
  }

  async getUserOffers(userId: string) {
    return this.prisma.userOffer.findMany({
      where: { userId },
      include: {
        offer: { include: { place: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
