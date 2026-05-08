import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '../common/mock-data';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({
              id: '1',
              phone: '0901234567',
              role: UserRole.USER,
            }),
            login: jest
              .fn()
              .mockResolvedValue({ access_token: 'at', refresh_token: 'rt' }),
            refreshToken: jest
              .fn()
              .mockResolvedValue({ access_token: 'at2', refresh_token: 'rt2' }),
            getProfile: jest.fn().mockResolvedValue({
              id: 'u1',
              phone: '0901234567',
              role: UserRole.USER,
            }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const dto = {
        phone: '0901234567',
        fullName: 'Test',
        password: 'password',
      };
      await controller.register(dto);
      expect(service.register as jest.Mock).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto = { phone: '0901234567', password: 'password' };
      await controller.login(dto);
      expect(service.login as jest.Mock).toHaveBeenCalledWith(dto);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken', async () => {
      const dto = { refresh_token: 'rt' };
      await controller.refreshToken(dto);
      expect(service.refreshToken as jest.Mock).toHaveBeenCalledWith('rt');
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile', async () => {
      await controller.getProfile('u1');
      expect(service.getProfile as jest.Mock).toHaveBeenCalledWith('u1');
    });
  });
});
