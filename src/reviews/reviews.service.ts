import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { mockDb } from '../common/mock-data';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  create(createReviewDto: CreateReviewDto) {
    const { userId, placeId } = createReviewDto;

    // Check if user already reviewed this place
    const existing = mockDb.reviews.find(
      (r) => r.userId === userId && r.placeId === placeId,
    );

    if (existing) {
      throw new BadRequestException(
        'Mỗi người dùng chỉ được đánh giá tại một địa điểm tối đa 01 lần.',
      );
    }

    const review = {
      ...createReviewDto,
      images: createReviewDto.images || [],
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.reviews.push(review);
    return review;
  }

  findAllByPlace(placeId: string) {
    return mockDb.reviews
      .filter((r) => r.placeId === placeId)
      .map((r) => ({
        ...r,
        user: mockDb.users
          .filter((u) => u.id === r.userId)
          .map((u) => ({ id: u.id, fullName: u.fullName }))[0],
        reply: mockDb.reviewReplies.find((rep) => rep.reviewId === r.id),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  update(id: string, updateReviewDto: UpdateReviewDto) {
    const index = mockDb.reviews.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new NotFoundException('Không tìm thấy đánh giá để cập nhật.');
    }

    mockDb.reviews[index] = {
      ...mockDb.reviews[index],
      ...updateReviewDto,
      updatedAt: new Date(),
    };
    return mockDb.reviews[index];
  }

  remove(id: string) {
    const index = mockDb.reviews.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new NotFoundException('Không tìm thấy đánh giá để xóa.');
    }

    const deleted = mockDb.reviews.splice(index, 1);
    return deleted[0];
  }

  reply(reviewId: string, content: string) {
    if (!content)
      throw new BadRequestException('Nội dung phản hồi không được để trống.');

    const review = mockDb.reviews.find((r) => r.id === reviewId);
    if (!review)
      throw new NotFoundException('Không tìm thấy đánh giá để phản hồi.');

    let reply = mockDb.reviewReplies.find((rep) => rep.reviewId === reviewId);
    if (reply) {
      reply.content = content;
      reply.updatedAt = new Date();
    } else {
      reply = {
        id: mockDb.generateId(),
        reviewId,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDb.reviewReplies.push(reply);
    }

    return reply;
  }
}
