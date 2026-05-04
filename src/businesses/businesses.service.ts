import { Injectable, NotFoundException } from '@nestjs/common';
import { mockDb } from '../common/mock-data';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  create(createBusinessDto: CreateBusinessDto) {
    const business = {
      ...createBusinessDto,
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.businesses.push(business);
    return business;
  }

  findAll() {
    return mockDb.businesses.map((b) => ({
      ...b,
      brands: mockDb.brands.filter((br) => br.businessId === b.id),
    }));
  }

  findOne(id: string) {
    const business = mockDb.businesses.find((b) => b.id === id);
    if (!business) throw new NotFoundException('Business not found');
    return {
      ...business,
      brands: mockDb.brands.filter((br) => br.businessId === business.id),
    };
  }

  update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const index = mockDb.businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException('Business not found');

    mockDb.businesses[index] = {
      ...mockDb.businesses[index],
      ...updateBusinessDto,
      updatedAt: new Date(),
    };
    return mockDb.businesses[index];
  }

  remove(id: string) {
    const index = mockDb.businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException('Business not found');

    const deleted = mockDb.businesses.splice(index, 1);
    return deleted[0];
  }
}
