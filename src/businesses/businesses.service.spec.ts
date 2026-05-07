import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesService } from './businesses.service';
import { MailService } from '../mail/mail.service';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../common/mock-data';
import {
  MockBusinessesRepository,
  MockUsersRepository,
} from '../common/mock-repositories';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        {
          provide: 'IBUSINESSES_REPOSITORY',
          useClass: MockBusinessesRepository,
        },
        {
          provide: 'IUSERS_REPOSITORY',
          useClass: MockUsersRepository,
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest
              .fn()
              .mockImplementation(
                (cb: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
                  cb({} as Prisma.TransactionClient),
              ),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendBusinessLoginInfo: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWithUser', () => {
    it('should create business and user, then send email', async () => {
      const dto = {
        phone: '0988888888',
        fullName: 'Business Owner',
        businessName: 'My Business',
        email: 'owner@example.com',
      };
      const result = await service.createWithUser(dto);
      expect(result.business.name).toBe(dto.businessName);
      expect(result.user.phone).toBe(dto.phone);
      expect(mailService.sendBusinessLoginInfo).toHaveBeenCalled();
    });

    it('should throw BadRequestException if phone exists', async () => {
      const dto = {
        phone: '0901234567',
        fullName: 'Existing',
        businessName: 'Existing',
        email: 'exist@example.com',
      };
      await expect(service.createWithUser(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated businesses', async () => {
      const result = await service.findAll({ page: 1, limit: 10, skip: 0 });
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a business if found', async () => {
      const result = await service.findOne('b1');
      expect(result.id).toBe('b1');
    });

    it('should throw NotFoundException if not found', async () => {
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update business if user is owner', async () => {
      const result = await service.update(
        'b1',
        { name: 'Updated Name' },
        'u3',
        UserRole.BUSINESS,
      );
      expect(result.name).toBe('Updated Name');
    });

    it('should update business if user is admin', async () => {
      const result = await service.update(
        'b1',
        { name: 'Admin Update' },
        'u2',
        UserRole.ADMIN,
      );
      expect(result.name).toBe('Admin Update');
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      await expect(
        service.update('b1', { name: 'Fail' }, 'u1', UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByUserId', () => {
    it('should return business for a user', async () => {
      const result = await service.findByUserId('u3');
      expect(result.userId).toBe('u3');
    });

    it('should throw NotFoundException if user has no business', async () => {
      await expect(service.findByUserId('u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
