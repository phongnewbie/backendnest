import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  IPlacesRepository,
  PlaceWithBrandAndReviews,
  PlaceWithFullDetails,
} from './places.repository.interface';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FindAllPlacesDto } from './dto/find-all-places.dto';
import { Place, Prisma } from '@prisma/client';

@Injectable()
export class PrismaPlacesRepository implements IPlacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlaceDto): Promise<Place> {
    return this.prisma.place.create({
      data: {
        ...data,
        checkInRadius: data.checkInRadius ?? 500,
        images: data.images || [],
      },
    });
  }

  async findAll(query: FindAllPlacesDto): Promise<PlaceWithBrandAndReviews[]> {
    const { swLat, swLng, neLat, neLng, q, category } = query;
    const where: Prisma.PlaceWhereInput = {};

    if (
      swLat !== undefined &&
      swLng !== undefined &&
      neLat !== undefined &&
      neLng !== undefined
    ) {
      where.latitude = { gte: swLat, lte: neLat };
      where.longitude = { gte: swLng, lte: neLng };
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { brand: { name: { contains: q, mode: 'insensitive' } } },
        { brand: { business: { name: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    if (category) {
      where.brand = { category };
    }

    return this.prisma.place.findMany({
      where,
      include: {
        brand: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<PlaceWithFullDetails | null> {
    return this.prisma.place.findUnique({
      where: { id },
      include: {
        brand: {
          include: {
            business: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
            replies: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        offers: {
          where: {
            validTo: { gte: new Date() },
          },
        },
        _count: {
          select: {
            checkins: true,
            reviews: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdatePlaceDto): Promise<Place> {
    return this.prisma.place.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Place> {
    return this.prisma.place.delete({
      where: { id },
    });
  }
}
