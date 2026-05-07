import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from './places.service';
import { mockDb, BrandCategory } from '../common/mock-data';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

describe('PlacesService', () => {
  let service: PlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacesService],
    }).compile();

    service = module.get<PlacesService>(PlacesService);

    // Reset mockDb data before each test
    mockDb.brands = [
      {
        id: 'br1',
        name: 'My Brand',
        businessId: 'b1',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: BrandCategory.COFFEE,
      },
      {
        id: 'br2',
        name: 'Other Brand',
        businessId: 'b2',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: BrandCategory.RESTAURANT,
      },
    ];
    mockDb.businesses = [
      {
        id: 'b1',
        name: 'My Biz',
        userId: 'u1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b2',
        name: 'Other Biz',
        userId: 'u2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockDb.places = [
      {
        id: 'p1',
        name: 'Place 1',
        address: 'Addr 1',
        latitude: 10,
        longitude: 106,
        brandId: 'br1',
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all places when no query provided', async () => {
      const result = await service.findAll({});
      expect(result.features.length).toBe(1);
      expect(result.features[0].properties.id).toBe('p1');
    });

    it('should filter by keyword q', async () => {
      const result = await service.findAll({ q: 'Place 1' });
      expect(result.features.length).toBe(1);
    });

    it('should filter by keyword q (no match)', async () => {
      const result = await service.findAll({ q: 'Non-existent' });
      expect(result.features.length).toBe(0);
    });

    it('should filter by bounding box', async () => {
      const result = await service.findAll({
        swLat: 9,
        swLng: 105,
        neLat: 11,
        neLng: 107,
      });
      expect(result.features.length).toBe(1);
    });

    it('should filter by bounding box (out of range)', async () => {
      const result = await service.findAll({
        swLat: 0,
        swLng: 0,
        neLat: 1,
        neLng: 1,
      });
      expect(result.features.length).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a place by id', async () => {
      const result = await service.findOne('p1');
      expect(result.id).toBe('p1');
    });

    it('should throw NotFoundException if not found', async () => {
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a place successfully if owner', async () => {
      const dto: CreatePlaceDto = {
        name: 'New',
        address: 'Addr',
        latitude: 1,
        longitude: 1,
        brandId: 'br1',
      };
      const result = await service.create(dto, 'u1');
      expect(result.name).toBe('New');
      expect(mockDb.places.length).toBe(2);
    });

    it('should throw NotFoundException if brand not found', async () => {
      const dto: CreatePlaceDto = {
        name: 'New',
        address: 'Addr',
        latitude: 1,
        longitude: 1,
        brandId: 'non-existent',
      };
      await expect(service.create(dto, 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if not owner', async () => {
      const dto: CreatePlaceDto = {
        name: 'New',
        address: 'Addr',
        latitude: 1,
        longitude: 1,
        brandId: 'br1',
      };
      await expect(service.create(dto, 'u2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update successfully if owner', async () => {
      const dto: UpdatePlaceDto = { name: 'Updated' };
      const result = await service.update('p1', dto, 'u1');
      expect(result.name).toBe('Updated');
      expect(mockDb.places[0].name).toBe('Updated');
    });

    it('should throw ForbiddenException if not owner', async () => {
      const dto: UpdatePlaceDto = { name: 'Updated' };
      await expect(service.update('p1', dto, 'u2')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if place not found', async () => {
      await expect(service.update('non-existent', {}, 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove successfully if owner', async () => {
      const result = await service.remove('p1', 'u1');
      expect(result.id).toBe('p1');
      expect(mockDb.places.length).toBe(0);
    });

    it('should throw ForbiddenException if not owner', async () => {
      await expect(service.remove('p1', 'u2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
