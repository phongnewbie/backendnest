import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaReviewsRepository } from './prisma-reviews.repository';

@Module({
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: 'IREVIEWS_REPOSITORY',
      useClass: PrismaReviewsRepository,
    },
  ],
})
export class ReviewsModule {}
