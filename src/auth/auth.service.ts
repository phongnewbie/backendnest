import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import type { IUsersRepository } from './users.repository.interface';
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
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUSERS_REPOSITORY')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findByPhone(
      registerDto.phone,
    );

    if (existingUser) {
      throw new BadRequestException('Số điện thoại đã được đăng ký');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersRepository.create({
      phone: registerDto.phone,
      fullName: registerDto.fullName,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const { password: _password, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByPhone(loginDto.phone);

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
      const user = await this.usersRepository.findById(payload.sub);

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
        expiresIn: '1h', // Increased for testing ease
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
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    const { password: _password, ...result } = user;
    return result;
  }
}
