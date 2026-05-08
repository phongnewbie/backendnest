import { Test, TestingModule } from '@nestjs/testing';
import { CheckinsService } from './checkins.service';
import { ConfigService } from '@nestjs/config';
import { DynamicQrService } from '../dynamic-qr/dynamic-qr.service';
import { GetCheckinsDto } from './dto/get-checkins.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QrType, UserRole, BrandCategory } from '@prisma/client';
import { ICheckinsRepository } from './checkins.repository.interface';
import {
  IPlacesRepository,
  PlaceWithFullDetails,
} from '../places/places.repository.interface';
import { IUsersRepository } from '../auth/users.repository.interface';

describe('CheckinsService', () => {
  let service: CheckinsService;
  let checkinsRepository: jest.Mocked<ICheckinsRepository>;
  let placesRepository: jest.Mocked<IPlacesRepository>;
  let usersRepository: jest.Mocked<IUsersRepository>;

  beforeEach(async () => {
    checkinsRepository = {
      create: jest.fn(),
      countDailyCheckIn: jest.fn(),
      findAllByPlace: jest.fn(),
      findPaginated: jest.fn(),
      findPaginatedByUser: jest.fn(),
    };

    placesRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    usersRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) =>
              key === 'MAX_CHECKIN_DISTANCE' ? 500 : null,
            ),
          },
        },
        {
          provide: DynamicQrService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
        {
          provide: 'ICHECKINS_REPOSITORY',
          useValue: checkinsRepository,
        },
        {
          provide: 'IPLACES_REPOSITORY',
          useValue: placesRepository,
        },
        {
          provide: 'IUSERS_REPOSITORY',
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<CheckinsService>(CheckinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create (Static QR)', () => {
    const mockPlace: PlaceWithFullDetails = {
      id: 'place-1',
      name: 'Test Place',
      address: 'Test Address',
      latitude: 10.762622,
      longitude: 106.660172,
      checkInRadius: 500,
      openTime: '08:00',
      closeTime: '22:00',
      phoneNumber: '0123456789',
      images: [],
      brandId: 'brand-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      brand: {
        id: 'brand-1',
        name: 'Test Brand',
        logoUrl: null,
        description: null,
        category: BrandCategory.COFFEE,
        businessId: 'bus-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        business: {
          id: 'bus-1',
          name: 'Test Bus',
        },
      },
      reviews: [],
      offers: [],
      _count: {
        checkins: 0,
        reviews: 0,
      },
    };

    const createDto = {
      placeId: 'place-1',
      latitude: 10.762622,
      longitude: 106.660172,
      phone: '0901234567',
    };

    it('should throw NotFoundException if place does not exist', async () => {
      placesRepository.findById.mockResolvedValue(null);
      await expect(service.create(createDto, null)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user is too far', async () => {
      placesRepository.findById.mockResolvedValue(mockPlace);
      const farDto = { ...createDto, latitude: 11.0, longitude: 107.0 };
      await expect(service.create(farDto, null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if already checked in today', async () => {
      placesRepository.findById.mockResolvedValue(mockPlace);
      checkinsRepository.countDailyCheckIn.mockResolvedValue(1);
      await expect(service.create(createDto, null)).rejects.toThrow(
        'Bạn đã check-in tại địa điểm này trong hôm nay.',
      );
    });

    it('should throw BadRequestException if guest provides no phone', async () => {
      placesRepository.findById.mockResolvedValue(mockPlace);
      const noPhoneDto = { ...createDto, phone: undefined };
      await expect(service.create(noPhoneDto, null)).rejects.toThrow(
        'Người dùng vãng lai bắt buộc cung cấp số điện thoại.',
      );
    });

    it('should create check-in successfully for guest', async () => {
      placesRepository.findById.mockResolvedValue(mockPlace);
      checkinsRepository.countDailyCheckIn.mockResolvedValue(0);
      checkinsRepository.create.mockResolvedValue({
        id: 'checkin-1',
        userId: null,
        placeId: 'place-1',
        latitude: 10.762622,
        longitude: 106.660172,
        deviceInfo: null,
        isGuest: true,
        phone: '0901234567',
        qrType: QrType.STATIC,
        createdAt: new Date(),
      });

      const result = await service.create(createDto, null);
      expect(result).toHaveProperty('id', 'checkin-1');
      expect(checkinsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: null,
          phone: '0901234567',
          qrType: QrType.STATIC,
          isGuest: true,
        }),
      );
    });

    it('should create check-in successfully for logged in user', async () => {
      const mockUser = {
        id: 'user-1',
        phone: '0988888888',
        fullName: 'Test User',
        password: 'hashedpassword',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      placesRepository.findById.mockResolvedValue(mockPlace);
      usersRepository.findById.mockResolvedValue(mockUser);
      checkinsRepository.countDailyCheckIn.mockResolvedValue(0);
      checkinsRepository.create.mockResolvedValue({
        id: 'checkin-2',
        userId: 'user-1',
        placeId: 'place-1',
        latitude: 10.762622,
        longitude: 106.660172,
        deviceInfo: null,
        isGuest: false,
        phone: '0988888888',
        qrType: QrType.STATIC,
        createdAt: new Date(),
      });

      const result = await service.create(
        { ...createDto, phone: undefined },
        'user-1',
      );
      expect(result).toHaveProperty('id', 'checkin-2');
      expect(checkinsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          phone: '0988888888',
          qrType: QrType.STATIC,
          isGuest: false,
        }),
      );
    });
  });

  describe('findPaginated', () => {
    it('should return paginated check-ins with meta info', async () => {
      const mockCheckins = [
        { id: 'c1', createdAt: new Date() },
        { id: 'c2', createdAt: new Date() },
      ];
      checkinsRepository.findPaginated = jest
        .fn()
        .mockResolvedValue(mockCheckins);

      const query: GetCheckinsDto = {
        placeId: 'place-1',
        limit: 1,
      };

      const result = await service.findPaginated(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.nextCursor).toBe('c1');
    });

    it('should return hasNextPage false if less items than limit', async () => {
      const mockCheckins = [{ id: 'c1', createdAt: new Date() }];
      checkinsRepository.findPaginated = jest
        .fn()
        .mockResolvedValue(mockCheckins);

      const query: GetCheckinsDto = {
        placeId: 'place-1',
        limit: 10,
      };

      const result = await service.findPaginated(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.nextCursor).toBe(null);
    });
  });
});
