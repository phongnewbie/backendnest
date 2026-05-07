import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BusinessesModule } from './businesses/businesses.module';
import { BrandsModule } from './brands/brands.module';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CheckinsModule } from './checkins/checkins.module';
import { DynamicQrModule } from './dynamic-qr/dynamic-qr.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './common/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    MailModule,
    BusinessesModule,
    BrandsModule,
    PlacesModule,
    ReviewsModule,
    CheckinsModule,
    DynamicQrModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
