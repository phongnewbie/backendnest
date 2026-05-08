import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateCheckInDto {
  @ApiProperty({ example: 'uuid-of-place', description: 'ID of the place' })
  @IsUUID('4', { message: 'ID địa điểm không hợp lệ' })
  @IsNotEmpty({ message: 'ID địa điểm không được để trống' })
  placeId!: string;

  @ApiPropertyOptional({ example: 10.762622, description: 'Latitude' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 106.660172, description: 'Longitude' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    example: 'iPhone 15, iOS 17.1',
    description: 'Device information',
  })
  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @ApiPropertyOptional({
    example: '0901234567',
    description: 'Phone number for guest check-in',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
