import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { mockDb } from '../common/mock-data';

@Injectable()
export class DynamicQrService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(placeId: string) {
    const place = mockDb.places.find((p) => p.id === placeId);
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
