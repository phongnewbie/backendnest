import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class DynamicCheckInDto {
  @ApiPropertyOptional({
    example: 'uuid-of-user',
    description: 'ID of the user',
  })
  @IsUUID('4', { message: 'ID người dùng không hợp lệ' })
  @IsOptional()
  userId?: string;

  @ApiProperty({
    example: 'base64-encoded-token',
    description: 'Token from Dynamic QR Code',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token quét từ QR Code không được để trống' })
  token: string;

  @ApiPropertyOptional({
    example: 'Samsung S24, Android 14',
    description: 'Device information',
  })
  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @ApiPropertyOptional({
    example: '0987654321',
    description: 'Phone number for guest check-in',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
