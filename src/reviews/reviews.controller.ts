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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created' })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews for a place' })
  @ApiQuery({ name: 'placeId', type: 'string', required: true })
  findAllByPlace(@Query('placeId', ParseUUIDPipe) placeId: string) {
    return this.reviewsService.findAllByPlace(placeId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }

  @Post(':id/reply')
  @ApiOperation({ summary: 'Reply to a review' })
  reply(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() replyReviewDto: ReplyReviewDto,
  ) {
    return this.reviewsService.reply(id, replyReviewDto.content);
  }
}
