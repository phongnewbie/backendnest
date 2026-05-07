import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  MockBrandsRepository,
  MockBusinessesRepository,
} from '../common/mock-repositories';

describe('BrandsService', () => {
  let service: BrandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: 'IBRANDS_REPOSITORY',
          useClass: MockBrandsRepository,
        },
        {
          provide: 'IBUSINESSES_REPOSITORY',
          useClass: MockBusinessesRepository,
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMyBrands', () => {
    it('should return paginated brands for a valid business user', async () => {
      const userId = 'u3'; // "Chủ Doanh Nghiệp" in mockDb
      const paginationDto: PaginationDto = { page: 1, limit: 10, skip: 0 };

      const result = await service.findMyBrands(userId, paginationDto);

      expect(result.data).toBeDefined();
      expect(result.data.length).toBeLessThanOrEqual(10);
      expect(result.meta).toBeDefined();
      expect(result.meta.currentPage).toBe(1);
    });

    it('should return empty data for a user with no business', async () => {
      const userId = 'non-existent-user';
      const paginationDto: PaginationDto = { page: 1, limit: 10, skip: 0 };

      const result = await service.findMyBrands(userId, paginationDto);

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });
  });
});
