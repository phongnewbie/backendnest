import { Offer, UserOffer, Prisma, OfferStatus } from '@prisma/client';
import { CreateOfferDto } from './dto/create-offer.dto';

export type UserOfferWithOffer = Prisma.UserOfferGetPayload<{
  include: {
    offer: {
      include: {
        place: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

export interface IOffersRepository {
  create(data: CreateOfferDto): Promise<Offer>;
  findAllByPlace(placeId: string): Promise<Offer[]>;
  findById(id: string): Promise<Offer | null>;
  findUserOffer(userId: string, offerId: string): Promise<UserOffer | null>;
  createUserOffer(
    userId: string,
    offerId: string,
    status: OfferStatus,
  ): Promise<UserOffer>;
  getUserOffers(userId: string): Promise<UserOfferWithOffer[]>;
}
