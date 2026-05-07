import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/mock-data';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';

describe('PlacesController', () => {
  let controller: PlacesController;
  let service: PlacesService;

  const mockPlacesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    sub: 'u3',
    phone: '0901111111',
    role: UserRole.BUSINESS,
  };

  const mockReq = {
    user: mockUser,
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        {
          provide: PlacesService,
          useValue: mockPlacesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PlacesController>(PlacesController);
    service = module.get<PlacesService>(PlacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const dto: CreatePlaceDto = {
        name: 'New Place',
        address: '123 St',
        latitude: 10,
        longitude: 106,
        brandId: 'br1',
      };
      const expectedResult = { id: 'p1', ...dto };
      mockPlacesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, mockReq);

      expect(service.create).toHaveBeenCalledWith(dto, mockUser.sub);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = 'p1';
      const dto: UpdatePlaceDto = {
        name: 'Updated Place',
      };
      const expectedResult = { id, ...dto };
      mockPlacesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, dto, mockReq);

      expect(service.update).toHaveBeenCalledWith(id, dto, mockUser.sub);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct parameters', async () => {
      const id = 'p1';
      const expectedResult = { id, name: 'Deleted Place' };
      mockPlacesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id, mockReq);

      expect(service.remove).toHaveBeenCalledWith(id, mockUser.sub);
      expect(result).toEqual(expectedResult);
    });
  });
});
