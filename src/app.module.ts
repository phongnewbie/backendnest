import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BusinessesModule } from './businesses/businesses.module';
import { BrandsModule } from './brands/brands.module';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CheckinsModule } from './checkins/checkins.module';
import { DynamicQrModule } from './dynamic-qr/dynamic-qr.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    BusinessesModule,
    BrandsModule,
    PlacesModule,
    ReviewsModule,
    CheckinsModule,
    DynamicQrModule,
    OffersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
