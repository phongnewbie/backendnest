import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({ example: 'Coffee House', description: 'Name of the place' })
  @IsString()
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống' })
  name!: string;

  @ApiProperty({
    example: '123 Nguyen Hue, Dist 1, HCMC',
    description: 'Address of the place',
  })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address!: string;

  @ApiProperty({ example: 10.776, description: 'Latitude' })
  @IsNumber()
  @IsNotEmpty()
  latitude!: number;

  @ApiProperty({ example: 106.701, description: 'Longitude' })
  @IsNumber()
  @IsNotEmpty()
  longitude!: number;

  @ApiPropertyOptional({
    example: '08:00 - 22:00',
    description: 'Opening hours',
  })
  @IsString()
  @IsOptional()
  openingHours?: string;

  @ApiPropertyOptional({ example: '02812345678', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/img1.jpg'],
    description: 'Array of image URLs',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'uuid-of-brand', description: 'ID of the brand' })
  @IsUUID('4', { message: 'ID nhãn hàng không hợp lệ' })
  @IsNotEmpty()
  brandId!: string;
}
