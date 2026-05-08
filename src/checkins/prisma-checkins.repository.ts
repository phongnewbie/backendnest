import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  ICheckinsRepository,
  CheckInWithUser,
  CheckInWithPlace,
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
      include: { user: { select: { id: true, fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPaginated(params: {
    placeId: string;
    cursor?: string;
    limit: number;
  }): Promise<CheckInWithUser[]> {
    const { placeId, cursor, limit } = params;
    return this.prisma.checkIn.findMany({
      where: { placeId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: { user: { select: { id: true, fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPaginatedByUser(params: {
    userId: string;
    cursor?: string;
    limit: number;
    from?: Date;
    to?: Date;
  }): Promise<CheckInWithPlace[]> {
    const { userId, cursor, limit, from, to } = params;
    return this.prisma.checkIn.findMany({
      where: {
        userId,
        ...(from || to ? { createdAt: { gte: from, lte: to } } : {}),
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: { place: { select: { id: true, name: true, address: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countDailyCheckIn(params: {
    placeId: string;
    userId?: string | null;
    phone?: string | null;
    startDate: Date;
    endDate: Date;
  }): Promise<number> {
    const { placeId, userId, phone, startDate, endDate } = params;
    const orConditions: Prisma.CheckInWhereInput[] = [];
    if (userId) orConditions.push({ userId });
    if (phone) orConditions.push({ phone });

    return this.prisma.checkIn.count({
      where: {
        placeId,
        createdAt: { gte: startDate, lte: endDate },
        OR: orConditions.length > 0 ? orConditions : undefined,
      },
    });
  }
}
