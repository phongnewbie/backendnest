import { Review, ReviewReply, Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

export type ReviewWithUserAndReplies = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        fullName: true;
      };
    };
    replies: true;
  };
}>;

export interface IReviewsRepository {
  create(data: CreateReviewDto): Promise<Review>;
  findFirst(where: Prisma.ReviewWhereInput): Promise<Review | null>;
  findAllByPlace(placeId: string): Promise<ReviewWithUserAndReplies[]>;
  findById(id: string): Promise<Review | null>;
  update(id: string, data: UpdateReviewDto): Promise<Review>;
  delete(id: string): Promise<Review>;
  findReply(reviewId: string): Promise<ReviewReply | null>;
  createReply(reviewId: string, content: string): Promise<ReviewReply>;
  updateReply(id: string, content: string): Promise<ReviewReply>;
}
