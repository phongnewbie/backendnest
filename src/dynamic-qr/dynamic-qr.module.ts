import { Module } from '@nestjs/common';
import { DynamicQrService } from './dynamic-qr.service';
import { DynamicQrController } from './dynamic-qr.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PlacesModule } from '../places/places.module';

@Module({
  imports: [
    PlacesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'default-secret-for-dev',
        ),
        signOptions: { expiresIn: '60s' }, // Token valid for 60 seconds
      }),
    }),
  ],
  controllers: [DynamicQrController],
  providers: [DynamicQrService],
  exports: [DynamicQrService],
})
export class DynamicQrModule {}
