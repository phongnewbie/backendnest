import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateCheckInDto {
  @IsUUID('4', { message: 'ID người dùng không hợp lệ' })
  @IsOptional()
  userId?: string;

  @IsUUID('4', { message: 'ID địa điểm không hợp lệ' })
  @IsNotEmpty({ message: 'ID địa điểm không được để trống' })
  placeId: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
