import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { PrismaPlacesRepository } from './prisma-places.repository';
import { BrandsModule } from '../brands/brands.module';
import { BusinessesModule } from '../businesses/businesses.module';

@Module({
  imports: [BrandsModule, BusinessesModule],
  controllers: [PlacesController],
  providers: [
    PlacesService,
    {
      provide: 'IPLACES_REPOSITORY',
      useClass: PrismaPlacesRepository,
    },
  ],
  exports: [PlacesService, 'IPLACES_REPOSITORY'],
})
export class PlacesModule {}
