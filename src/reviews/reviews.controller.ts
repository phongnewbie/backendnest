import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAllByPlace(@Query('placeId', ParseUUIDPipe) placeId: string) {
    return this.reviewsService.findAllByPlace(placeId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { rating?: number; content?: string; images?: string[] },
  ) {
    return this.reviewsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }

  @Post(':id/reply')
  reply(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('content') content: string,
  ) {
    return this.reviewsService.reply(id, content);
  }
}
