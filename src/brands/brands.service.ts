import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    logoUrl?: string;
    description?: string;
    businessId: string;
  }) {
    return this.prisma.brand.create({ data });
  }

  async findAll() {
    return this.prisma.brand.findMany({
      include: { business: true, places: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
      include: { business: true, places: true },
    });
  }

  async update(
    id: string,
    data: { name?: string; logoUrl?: string; description?: string },
  ) {
    return this.prisma.brand.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.brand.delete({ where: { id } });
  }
}
