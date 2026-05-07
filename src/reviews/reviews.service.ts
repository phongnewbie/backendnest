import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import type { IReviewsRepository } from './reviews.repository.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('IREVIEWS_REPOSITORY')
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const { userId, placeId } = createReviewDto;

    // Check if user already reviewed this place
    const existing = await this.reviewsRepository.findFirst({
      userId,
      placeId,
    });

    if (existing) {
      throw new BadRequestException(
        'Mỗi người dùng chỉ được đánh giá tại một địa điểm tối đa 01 lần.',
      );
    }

    return this.reviewsRepository.create(createReviewDto);
  }

  async findAllByPlace(placeId: string) {
    return this.reviewsRepository.findAllByPlace(placeId);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá để cập nhật.');
    }

    return this.reviewsRepository.update(id, updateReviewDto);
  }

  async remove(id: string) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá để xóa.');
    }

    return this.reviewsRepository.delete(id);
  }

  async reply(reviewId: string, content: string) {
    if (!content)
      throw new BadRequestException('Nội dung phản hồi không được để trống.');

    const review = await this.reviewsRepository.findById(reviewId);
    if (!review)
      throw new NotFoundException('Không tìm thấy đánh giá để phản hồi.');

    const existingReply = await this.reviewsRepository.findReply(reviewId);

    if (existingReply) {
      return this.reviewsRepository.updateReply(existingReply.id, content);
    } else {
      return this.reviewsRepository.createReply(reviewId, content);
    }
  }
}
