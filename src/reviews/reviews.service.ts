import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { userId, placeId } = createReviewDto;

    // Check if user already reviewed this place
    const existing = await this.prisma.review.findUnique({
      where: {
        userId_placeId: { userId, placeId },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Mỗi người dùng chỉ được đánh giá tại một địa điểm tối đa 01 lần.',
      );
    }

    try {
      return await this.prisma.review.create({
        data: createReviewDto,
      });
    } catch {
      throw new BadRequestException(
        'Không thể tạo đánh giá. Vui lòng kiểm tra lại thông tin.',
      );
    }
  }

  async findAllByPlace(placeId: string) {
    return this.prisma.review.findMany({
      where: { placeId },
      include: {
        user: { select: { id: true, fullName: true } },
        reply: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    data: { rating?: number; content?: string; images?: string[] },
  ) {
    try {
      return await this.prisma.review.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Không tìm thấy đánh giá để cập nhật.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.review.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Không tìm thấy đánh giá để xóa.');
    }
  }

  async reply(reviewId: string, content: string) {
    if (!content)
      throw new BadRequestException('Nội dung phản hồi không được để trống.');

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review)
      throw new NotFoundException('Không tìm thấy đánh giá để phản hồi.');

    return this.prisma.reviewReply.upsert({
      where: { reviewId },
      update: { content },
      create: { reviewId, content },
    });
  }
}
