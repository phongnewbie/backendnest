import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { IBrandsRepository } from './brands.repository.interface';
import type { IBusinessesRepository } from '../businesses/businesses.repository.interface';

@Injectable()
export class BrandsService {
  constructor(
    @Inject('IBRANDS_REPOSITORY')
    private readonly brandsRepository: IBrandsRepository,
    @Inject('IBUSINESSES_REPOSITORY')
    private readonly businessesRepository: IBusinessesRepository,
  ) {}

  async create(createBrandDto: CreateBrandDto, requestUserId: string) {
    const business = await this.businessesRepository.findById(
      createBrandDto.businessId,
    );
    if (!business) {
      throw new NotFoundException('Doanh nghiệp không tồn tại');
    }

    if (business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo thương hiệu cho doanh nghiệp này',
      );
    }

    return this.brandsRepository.create(createBrandDto);
  }

  async findAll() {
    return this.brandsRepository.findAll();
  }

  async findMyBrands(userId: string, paginationDto: PaginationDto) {
    const business = await this.businessesRepository.findByUserId(userId);
    if (!business) return { data: [], meta: this.getEmptyMeta(paginationDto) };

    const { page = 1, limit = 10, skip } = paginationDto;

    const [totalItems, brands] = await this.brandsRepository.findMyBrands(
      business.id,
      skip,
      limit,
    );

    return {
      data: brands,
      meta: {
        itemCount: brands.length,
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
    const brand = await this.brandsRepository.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
    requestUserId: string,
  ) {
    const brand = await this.brandsRepository.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');

    const business = await this.businessesRepository.findById(brand.businessId);

    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa thương hiệu này',
      );
    }

    return this.brandsRepository.update(id, updateBrandDto);
  }

  async remove(id: string, requestUserId: string) {
    const brand = await this.brandsRepository.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');

    const business = await this.businessesRepository.findById(brand.businessId);

    if (!business || business.userId !== requestUserId) {
      throw new ForbiddenException('Bạn không có quyền xóa thương hiệu này');
    }

    return this.brandsRepository.delete(id);
  }
}
