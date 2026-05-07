import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { UserRole } from '../common/mock-data';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('BusinessesController', () => {
  let controller: BusinessesController;
  let service: BusinessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessesController],
      providers: [
        {
          provide: BusinessesService,
          useValue: {
            createWithUser: jest
              .fn()
              .mockResolvedValue({ business: { id: '1' } }),
            findByUserId: jest.fn().mockResolvedValue({ id: '1' }),
            findAll: jest.fn().mockResolvedValue({ data: [], meta: {} }),
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

    controller = module.get<BusinessesController>(BusinessesController);
    service = module.get<BusinessesService>(BusinessesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.createWithUser', async () => {
      const dto = {
        phone: '0901234567',
        fullName: 'Test',
        businessName: 'Biz',
        email: 'test@example.com',
      };
      await controller.create(dto);
      expect(service.createWithUser as jest.Mock).toHaveBeenCalledWith(dto);
    });
  });

  describe('getMyBusiness', () => {
    it('should call service.findByUserId', async () => {
      const req = {
        user: { sub: 'u1', phone: '0901234567', role: UserRole.BUSINESS },
      } as unknown as RequestWithUser;
      await controller.getMyBusiness(req);
      expect(service.findByUserId as jest.Mock).toHaveBeenCalledWith('u1');
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const paginationDto = new PaginationDto();
      paginationDto.page = 1;
      paginationDto.limit = 10;
      await controller.findAll(paginationDto);
      expect(service.findAll as jest.Mock).toHaveBeenCalledWith(paginationDto);
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
      const dto = { name: 'Updated' };
      const req = {
        user: { sub: 'u1', phone: '0901234567', role: UserRole.BUSINESS },
      } as unknown as RequestWithUser;
      await controller.update('1', dto, req);
      expect(service.update as jest.Mock).toHaveBeenCalledWith(
        '1',
        dto,
        'u1',
        UserRole.BUSINESS,
      );
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      await controller.remove('1');
      expect(service.remove as jest.Mock).toHaveBeenCalledWith('1');
    });
  });
});
