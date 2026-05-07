import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { mockDb } from '../common/mock-data';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BrandsService {
  async create(createBrandDto: CreateBrandDto, requestUserId: string) {
    const business = mockDb.businesses.find(
      (b) => b.id === createBrandDto.businessId,
    );
    if (!business) {
      throw new NotFoundException('Doanh nghiệp không tồn tại');
    }

    // Strict Ownership check: Only the business owner can create brands
    if (business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo thương hiệu cho doanh nghiệp này',
      );
    }

    const brand = {
      ...createBrandDto,
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.brands.push(brand);
    return brand;
  }

  async findAll() {
    return mockDb.brands.map((brand) => ({
      ...brand,
      business: mockDb.businesses.find((b) => b.id === brand.businessId),
      places: mockDb.places.filter((p) => p.brandId === brand.id),
    }));
  }

  async findMyBrands(userId: string, paginationDto: PaginationDto) {
    const business = mockDb.businesses.find((b) => b.userId === userId);
    if (!business) return { data: [], meta: this.getEmptyMeta(paginationDto) };

    const brands = mockDb.brands
      .filter((b) => b.businessId === business.id)
      .map((brand) => ({
        ...brand,
        places: mockDb.places.filter((p) => p.brandId === brand.id),
      }));

    const totalItems = brands.length;
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const data = brands.slice(skip, skip + limit);

    return {
      data,
      meta: {
        itemCount: data.length,
        totalItems,
        itemsPerPage: Number(limit),
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
      },
    };
  }

  private getEmptyMeta(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    return {
      itemCount: 0,
      totalItems: 0,
      itemsPerPage: Number(limit),
      totalPages: 0,
      currentPage: Number(page),
    };
  }

  async findOne(id: string) {
    const brand = mockDb.brands.find((b) => b.id === id);
    if (!brand) throw new NotFoundException('Brand not found');

    return {
      ...brand,
      business: mockDb.businesses.find((b) => b.id === brand.businessId),
      places: mockDb.places.filter((p) => p.brandId === brand.id),
    };
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
    requestUserId: string,
  ) {
    const brand = mockDb.brands.find((b) => b.id === id);
    if (!brand) throw new NotFoundException('Brand not found');

    const business = mockDb.businesses.find((b) => b.id === brand.businessId);

    // Strict Ownership check: Only the business owner can update
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa thương hiệu này',
      );
    }

    const index = mockDb.brands.findIndex((b) => b.id === id);

    // Ensure businessId is not updated
    const { ...updateData } = updateBrandDto;

    mockDb.brands[index] = {
      ...mockDb.brands[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return mockDb.brands[index];
  }

  async remove(id: string, requestUserId: string) {
    const brand = mockDb.brands.find((b) => b.id === id);
    if (!brand) throw new NotFoundException('Brand not found');

    const business = mockDb.businesses.find((b) => b.id === brand.businessId);

    // Strict Ownership check: Only the business owner can remove
    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException('Bạn không có quyền xóa thương hiệu này');
    }

    const index = mockDb.brands.findIndex((b) => b.id === id);
    const deleted = mockDb.brands.splice(index, 1);
    return deleted[0];
  }
}
