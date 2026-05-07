import { Brand, Prisma } from '@prisma/client';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

export type BrandWithDetails = Prisma.BrandGetPayload<{
  include: { business: true; places: true };
}>;

export type BrandWithPlaces = Prisma.BrandGetPayload<{
  include: { places: true };
}>;

export interface IBrandsRepository {
  create(data: CreateBrandDto): Promise<Brand>;
  findAll(): Promise<BrandWithDetails[]>;
  findMyBrands(
    businessId: string,
    skip: number,
    limit: number,
  ): Promise<[number, BrandWithPlaces[]]>;
  findById(id: string): Promise<BrandWithDetails | null>;
  update(id: string, data: UpdateBrandDto): Promise<Brand>;
  delete(id: string): Promise<Brand>;
}
