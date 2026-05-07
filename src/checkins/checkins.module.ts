import { Module } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CheckinsController } from './checkins.controller';
import { DynamicQrModule } from '../dynamic-qr/dynamic-qr.module';
import { PrismaCheckinsRepository } from './prisma-checkins.repository';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [DynamicQrModule, PlacesModule],
  controllers: [CheckinsController],
  providers: [
    CheckinsService,
    {
      provide: 'ICHECKINS_REPOSITORY',
      useClass: PrismaCheckinsRepository,
    },
  ],
})
export class CheckinsModule {}
