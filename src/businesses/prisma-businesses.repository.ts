import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { IBusinessesRepository } from './businesses.repository.interface';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business, Prisma } from '@prisma/client';

type BusinessWithBrands = Prisma.BusinessGetPayload<{
  include: { brands: true };
}>;

@Injectable()
export class PrismaBusinessesRepository implements IBusinessesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.BusinessCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Business> {
    const client = tx || this.prisma;
    return client.business.create({ data });
  }

  async findAll(
    skip: number,
    limit: number,
  ): Promise<[number, BusinessWithBrands[]]> {
    return Promise.all([
      this.prisma.business.count(),
      this.prisma.business.findMany({
        skip,
        take: limit,
        include: {
          brands: true,
        },
      }),
    ]);
  }

  async findById(id: string): Promise<BusinessWithBrands | null> {
    return this.prisma.business.findUnique({
      where: { id },
      include: {
        brands: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<BusinessWithBrands | null> {
    return this.prisma.business.findUnique({
      where: { userId },
      include: {
        brands: true,
      },
    });
  }

  async update(id: string, data: UpdateBusinessDto): Promise<Business> {
    return this.prisma.business.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Business> {
    return this.prisma.business.delete({
      where: { id },
    });
  }
}
