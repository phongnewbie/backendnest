import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class DynamicCheckInDto {
  @IsUUID('4', { message: 'ID người dùng không hợp lệ' })
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Token quét từ QR Code không được để trống' })
  token: string;

  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
