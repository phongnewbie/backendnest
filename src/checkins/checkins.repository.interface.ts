import { CheckIn, Prisma } from '@prisma/client';

export type CheckInWithUser = Prisma.CheckInGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        fullName: true;
        phone: true;
      };
    };
  };
}>;

export interface ICheckinsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findAllByPlace(placeId: string): Promise<CheckInWithUser[]>;
}
