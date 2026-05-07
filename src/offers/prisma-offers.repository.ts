import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  IOffersRepository,
  UserOfferWithOffer,
} from './offers.repository.interface';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer, UserOffer, OfferStatus } from '@prisma/client';

@Injectable()
export class PrismaOffersRepository implements IOffersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOfferDto): Promise<Offer> {
    return this.prisma.offer.create({
      data: {
        ...data,
        validFrom: new Date(data.validFrom),
        validTo: new Date(data.validTo),
      },
    });
  }

  async findAllByPlace(placeId: string): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      where: {
        placeId,
        validTo: { gte: new Date() },
      },
      orderBy: {
        validFrom: 'asc',
      },
    });
  }

  async findById(id: string): Promise<Offer | null> {
    return this.prisma.offer.findUnique({
      where: { id },
    });
  }

  async findUserOffer(
    userId: string,
    offerId: string,
  ): Promise<UserOffer | null> {
    return this.prisma.userOffer.findFirst({
      where: { userId, offerId },
    });
  }

  async createUserOffer(
    userId: string,
    offerId: string,
    status: OfferStatus,
  ): Promise<UserOffer> {
    return this.prisma.userOffer.create({
      data: {
        userId,
        offerId,
        status,
      },
    });
  }

  async getUserOffers(userId: string): Promise<UserOfferWithOffer[]> {
    return this.prisma.userOffer.findMany({
      where: { userId },
      include: {
        offer: {
          include: {
            place: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
