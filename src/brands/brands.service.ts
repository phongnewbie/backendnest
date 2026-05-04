import { Injectable, NotFoundException } from '@nestjs/common';
import { mockDb } from '../common/mock-data';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  create(createBrandDto: CreateBrandDto) {
    const brand = {
      ...createBrandDto,
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.brands.push(brand);
    return brand;
  }

  findAll() {
    return mockDb.brands.map((brand) => ({
      ...brand,
      business: mockDb.businesses.find((b) => b.id === brand.businessId),
      places: mockDb.places.filter((p) => p.brandId === brand.id),
    }));
  }

  findOne(id: string) {
    const brand = mockDb.brands.find((b) => b.id === id);
    if (!brand) throw new NotFoundException('Brand not found');

    return {
      ...brand,
      business: mockDb.businesses.find((b) => b.id === brand.businessId),
      places: mockDb.places.filter((p) => p.brandId === brand.id),
    };
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    const index = mockDb.brands.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException('Brand not found');

    mockDb.brands[index] = {
      ...mockDb.brands[index],
      ...updateBrandDto,
      updatedAt: new Date(),
    };
    return mockDb.brands[index];
  }

  remove(id: string) {
    const index = mockDb.brands.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException('Brand not found');

    const deleted = mockDb.brands.splice(index, 1);
    return deleted[0];
  }
}
