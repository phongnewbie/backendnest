import { CheckIn, Prisma } from '@prisma/client';

export type CheckInWithUser = Prisma.CheckInGetPayload<{
  include: {
    user: {
      select: { id: true; fullName: true; phone: true };
    };
  };
}>;

export type CheckInWithPlace = Prisma.CheckInGetPayload<{
  include: {
    place: {
      select: { id: true; name: true; address: true };
    };
  };
}>;

export interface ICheckinsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findAllByPlace(placeId: string): Promise<CheckInWithUser[]>;
  findPaginated(params: {
    placeId: string;
    cursor?: string;
    limit: number;
  }): Promise<CheckInWithUser[]>;
  findPaginatedByUser(params: {
    userId: string;
    cursor?: string;
    limit: number;
    from?: Date;
    to?: Date;
  }): Promise<CheckInWithPlace[]>;
  countDailyCheckIn(params: {
    placeId: string;
    userId?: string | null;
    phone?: string | null;
    startDate: Date;
    endDate: Date;
  }): Promise<number>;
}
