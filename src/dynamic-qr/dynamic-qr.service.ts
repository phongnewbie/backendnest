import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DynamicQrService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateToken(placeId: string) {
    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
    });
    if (!place) {
      throw new NotFoundException('Địa điểm không tồn tại');
    }

    const payload = {
      placeId: place.id,
      type: 'DYNAMIC_QR',
      timestamp: Date.now(),
    };
    return {
      token: this.jwtService.sign(payload),
      expiresIn: 60, // seconds
    };
  }

  verifyToken(token: string): string | null {
    try {
      const decoded = this.jwtService.verify<{
        placeId: string;
        type: string;
        timestamp: number;
      }>(token);
      return decoded.placeId;
    } catch {
      return null;
    }
  }
}
