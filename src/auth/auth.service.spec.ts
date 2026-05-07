import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../common/mock-data';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            verifyAsync: jest.fn().mockResolvedValue({
              sub: 'u1',
              phone: '0901234567',
              role: UserRole.USER,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        phone: '0999999999',
        fullName: 'Test User',
        password: 'password123',
      };
      const result = await service.register(dto);
      expect(result.phone).toBe(dto.phone);
      expect(result.role).toBe(UserRole.USER);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw BadRequestException if phone exists', async () => {
      const dto = {
        phone: '0901234567',
        fullName: 'Existing User',
        password: 'password123',
      };
      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const dto = { phone: '0901234567', password: 'password123' };
      const result = await service.login(dto);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const dto = { phone: '0901234567', password: 'wrongpassword' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens for valid refresh token', async () => {
      const result = await service.refreshToken('valid-token');
      expect(result).toHaveProperty('access_token');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());
      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const result = await service.getProfile('u1');
      expect(result.id).toBe('u1');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      await expect(service.getProfile('non-existent')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
