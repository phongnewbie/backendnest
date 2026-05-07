import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { PrismaOffersRepository } from './prisma-offers.repository';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [PlacesModule],
  controllers: [OffersController],
  providers: [
    OffersService,
    {
      provide: 'IOFFERS_REPOSITORY',
      useClass: PrismaOffersRepository,
    },
  ],
})
export class OffersModule {}
