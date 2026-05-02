import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async create(createPlaceDto: CreatePlaceDto) {
    return this.prisma.place.create({
      data: createPlaceDto,
    });
  }

  async findAll() {
    return this.prisma.place.findMany({
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        _count: {
          select: { checkIns: true, reviews: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        brand: {
          include: {
            business: {
              select: { id: true, name: true },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, fullName: true },
            },
            reply: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { checkIns: true, reviews: true },
        },
      },
    });

    if (!place) {
      throw new NotFoundException(`Địa điểm với ID ${id} không tồn tại`);
    }

    // Calculate average rating
    const aggregate = await this.prisma.review.aggregate({
      where: { placeId: id },
      _avg: { rating: true },
    });

    return {
      ...place,
      averageRating: aggregate._avg.rating || 0,
    };
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    try {
      return await this.prisma.place.update({
        where: { id },
        data: updatePlaceDto,
      });
    } catch {
      throw new NotFoundException(
        `Không thể cập nhật: Địa điểm với ID ${id} không tồn tại`,
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.place.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(
        `Không thể xóa: Địa điểm với ID ${id} không tồn tại`,
      );
    }
  }
}
