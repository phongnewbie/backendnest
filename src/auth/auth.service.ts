import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { mockDb, UserRole } from '../common/mock-data';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: string;
  phone: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = mockDb.users.find(
      (u) => u.phone === registerDto.phone,
    );
    if (existingUser) {
      throw new BadRequestException('Số điện thoại đã được đăng ký');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = {
      ...registerDto,
      role: UserRole.USER,
      password: hashedPassword,
      id: mockDb.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDb.users.push(newUser);

    const { password: _password, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = mockDb.users.find((u) => u.phone === loginDto.phone);

    if (!user || !user.password) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }

    return this.generateTokens(user.id, user.phone, user.role);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const user = mockDb.users.find((u) => u.id === payload.sub);

      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }

      return this.generateTokens(user.id, user.phone, user.role);
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc hết hạn',
      );
    }
  }

  private async generateTokens(userId: string, phone: string, role: string) {
    const payload = { sub: userId, phone, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async getProfile(userId: string) {
    const user = mockDb.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    const { password: _password, ...result } = user;
    return result;
  }
}
