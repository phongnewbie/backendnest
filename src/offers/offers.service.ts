import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { OfferStatus } from '@prisma/client';
import { CreateOfferDto } from './dto/create-offer.dto';
import type { IOffersRepository } from './offers.repository.interface';
import type { IUsersRepository } from '../auth/users.repository.interface';
import type { IPlacesRepository } from '../places/places.repository.interface';

@Injectable()
export class OffersService {
  constructor(
    @Inject('IOFFERS_REPOSITORY')
    private readonly offersRepository: IOffersRepository,
    @Inject('IUSERS_REPOSITORY')
    private readonly usersRepository: IUsersRepository,
    @Inject('IPLACES_REPOSITORY')
    private readonly placesRepository: IPlacesRepository,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    const place = await this.placesRepository.findById(createOfferDto.placeId);
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

    return this.offersRepository.create(createOfferDto);
  }

  async findAllByPlace(placeId: string) {
    return this.offersRepository.findAllByPlace(placeId);
  }

  async saveOffer(userId: string, offerId: string) {
    const user = await this.usersRepository.findById(userId);
    const offer = await this.offersRepository.findById(offerId);

    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (!offer) throw new NotFoundException('Ưu đãi không tồn tại');
    if (offer.validTo < new Date())
      throw new BadRequestException('Ưu đãi đã hết hạn');

    const existing = await this.offersRepository.findUserOffer(userId, offerId);

    if (existing) {
      throw new BadRequestException('Bạn đã lưu ưu đãi này rồi');
    }

    return this.offersRepository.createUserOffer(
      userId,
      offerId,
      OfferStatus.SAVED,
    );
  }

  async getUserOffers(userId: string) {
    return this.offersRepository.getUserOffers(userId);
  }
}
