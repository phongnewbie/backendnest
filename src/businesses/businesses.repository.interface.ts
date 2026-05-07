import { Business, Prisma } from '@prisma/client';
import { UpdateBusinessDto } from './dto/update-business.dto';

export type BusinessWithBrands = Prisma.BusinessGetPayload<{
  include: { brands: true };
}>;

export interface IBusinessesRepository {
  create(
    data: Prisma.BusinessUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Business>;
  findAll(skip: number, limit: number): Promise<[number, BusinessWithBrands[]]>;
  findById(id: string): Promise<BusinessWithBrands | null>;
  findByUserId(userId: string): Promise<BusinessWithBrands | null>;
  update(id: string, data: UpdateBusinessDto): Promise<Business>;
  delete(id: string): Promise<Business>;
}
