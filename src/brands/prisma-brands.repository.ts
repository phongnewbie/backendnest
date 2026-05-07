import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  IBrandsRepository,
  BrandWithDetails,
  BrandWithPlaces,
} from './brands.repository.interface';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from '@prisma/client';

@Injectable()
export class PrismaBrandsRepository implements IBrandsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBrandDto): Promise<Brand> {
    return this.prisma.brand.create({
      data,
    });
  }

  async findAll(): Promise<BrandWithDetails[]> {
    return this.prisma.brand.findMany({
      include: {
        business: true,
        places: true,
      },
    });
  }

  async findMyBrands(
    businessId: string,
    skip: number,
    limit: number,
  ): Promise<[number, BrandWithPlaces[]]> {
    return Promise.all([
      this.prisma.brand.count({ where: { businessId } }),
      this.prisma.brand.findMany({
        where: { businessId },
        skip,
        take: limit,
        include: {
          places: true,
        },
      }),
    ]);
  }

  async findById(id: string): Promise<BrandWithDetails | null> {
    return this.prisma.brand.findUnique({
      where: { id },
      include: {
        business: true,
        places: true,
      },
    });
  }

  async update(id: string, data: UpdateBrandDto): Promise<Brand> {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Brand> {
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
