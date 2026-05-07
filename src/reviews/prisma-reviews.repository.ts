import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  IReviewsRepository,
  ReviewWithUserAndReplies,
} from './reviews.repository.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewReply, Prisma } from '@prisma/client';

@Injectable()
export class PrismaReviewsRepository implements IReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDto): Promise<Review> {
    return this.prisma.review.create({
      data: {
        ...data,
        images: data.images || [],
      },
    });
  }

  async findFirst(where: Prisma.ReviewWhereInput): Promise<Review | null> {
    return this.prisma.review.findFirst({ where });
  }

  async findAllByPlace(placeId: string): Promise<ReviewWithUserAndReplies[]> {
    return this.prisma.review.findMany({
      where: { placeId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        replies: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateReviewDto): Promise<Review> {
    return this.prisma.review.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Review> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async findReply(reviewId: string): Promise<ReviewReply | null> {
    return this.prisma.reviewReply.findFirst({
      where: { reviewId },
    });
  }

  async createReply(reviewId: string, content: string): Promise<ReviewReply> {
    return this.prisma.reviewReply.create({
      data: {
        reviewId,
        content,
      },
    });
  }

  async updateReply(id: string, content: string): Promise<ReviewReply> {
    return this.prisma.reviewReply.update({
      where: { id },
      data: { content },
    });
  }
}
