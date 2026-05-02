import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    description?: string;
    email?: string;
    phone?: string;
  }) {
    return this.prisma.business.create({ data });
  }

  async findAll() {
    return this.prisma.business.findMany({ include: { brands: true } });
  }

  async findOne(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
      include: { brands: true },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.prisma.business.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.business.delete({ where: { id } });
  }
}
