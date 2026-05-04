import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { mockDb, OfferStatus } from '../common/mock-data';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  create(createOfferDto: CreateOfferDto) {
    const place = mockDb.places.find((p) => p.id === createOfferDto.placeId);
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

    const offer = {
      ...createOfferDto,
      validFrom: new Date(createOfferDto.validFrom),
      validTo: new Date(createOfferDto.validTo),
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.offers.push(offer);
    return offer;
  }

  findAllByPlace(placeId: string) {
    const now = new Date();
    return mockDb.offers
      .filter((o) => o.placeId === placeId && o.validTo >= now)
      .sort((a, b) => a.validFrom.getTime() - b.validFrom.getTime());
  }

  saveOffer(userId: string, offerId: string) {
    const user = mockDb.users.find((u) => u.id === userId);
    const offer = mockDb.offers.find((o) => o.id === offerId);

    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (!offer) throw new NotFoundException('Ưu đãi không tồn tại');
    if (offer.validTo < new Date())
      throw new BadRequestException('Ưu đãi đã hết hạn');

    const existing = mockDb.userOffers.find(
      (uo) => uo.userId === userId && uo.offerId === offerId,
    );

    if (existing) {
      throw new BadRequestException('Bạn đã lưu ưu đãi này rồi');
    }

    const userOffer = {
      id: mockDb.generateId(),
      userId,
      offerId,
      status: OfferStatus.SAVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.userOffers.push(userOffer);
    return userOffer;
  }

  getUserOffers(userId: string) {
    return mockDb.userOffers
      .filter((uo) => uo.userId === userId)
      .map((uo) => ({
        ...uo,
        offer: {
          ...mockDb.offers.find((o) => o.id === uo.offerId),
          place: mockDb.places
            .filter(
              (p) =>
                p.id ===
                mockDb.offers.find((o) => o.id === uo.offerId)?.placeId,
            )
            .map((p) => ({ id: p.id, name: p.name }))[0],
        },
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
