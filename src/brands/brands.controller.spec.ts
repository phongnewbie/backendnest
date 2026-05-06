import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BrandCategory, UserRole } from '../common/mock-data';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: BrandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandsService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: '1' }),
            findAll: jest.fn().mockResolvedValue([]),
            findMyBrands: jest.fn().mockResolvedValue({ data: [], meta: {} }),
            findOne: jest.fn().mockResolvedValue({ id: '1' }),
            update: jest.fn().mockResolvedValue({ id: '1' }),
            remove: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BrandsController>(BrandsController);
    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto: CreateBrandDto = {
        name: 'Brand',
        businessId: 'b1',
        category: BrandCategory.COFFEE,
      };
      await controller.create(dto);
      expect(service.create as jest.Mock).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      await controller.findAll();
      expect(service.findAll as jest.Mock).toHaveBeenCalled();
    });
  });

  describe('findMyBrands', () => {
    it('should call service.findMyBrands', async () => {
      const paginationDto = new PaginationDto();
      paginationDto.page = 1;
      paginationDto.limit = 10;
      const req = {
        user: { sub: 'u1', phone: '0901234567', role: UserRole.BUSINESS },
      } as unknown as RequestWithUser;
      await controller.findMyBrands(paginationDto, req);
      expect(service.findMyBrands as jest.Mock).toHaveBeenCalledWith(
        'u1',
        paginationDto,
      );
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      await controller.findOne('1');
      expect(service.findOne as jest.Mock).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const dto: UpdateBrandDto = { name: 'Updated' };
      await controller.update('1', dto);
      expect(service.update as jest.Mock).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      await controller.remove('1');
      expect(service.remove as jest.Mock).toHaveBeenCalledWith('1');
    });
  });
});
