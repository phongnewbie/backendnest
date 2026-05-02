import { Module } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CheckinsController } from './checkins.controller';
import { DynamicQrModule } from '../dynamic-qr/dynamic-qr.module';

@Module({
  imports: [DynamicQrModule],
  controllers: [CheckinsController],
  providers: [CheckinsService],
})
export class CheckinsModule {}
