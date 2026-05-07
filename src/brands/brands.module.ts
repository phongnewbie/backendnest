import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PrismaBrandsRepository } from './prisma-brands.repository';
import { BusinessesModule } from '../businesses/businesses.module';

@Module({
  imports: [BusinessesModule],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    {
      provide: 'IBRANDS_REPOSITORY',
      useClass: PrismaBrandsRepository,
    },
  ],
  exports: [BrandsService, 'IBRANDS_REPOSITORY'],
})
export class BrandsModule {}
