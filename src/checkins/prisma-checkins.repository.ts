import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  ICheckinsRepository,
  CheckInWithUser,
} from './checkins.repository.interface';
import { CheckIn, Prisma } from '@prisma/client';

@Injectable()
export class PrismaCheckinsRepository implements ICheckinsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return this.prisma.checkIn.create({ data });
  }

  async findAllByPlace(placeId: string): Promise<CheckInWithUser[]> {
    return this.prisma.checkIn.findMany({
      where: { placeId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
