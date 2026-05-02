import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsOptional()
  openingHours?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsUUID('4', { message: 'ID nhãn hàng không hợp lệ' })
  @IsNotEmpty()
  brandId: string;
}
