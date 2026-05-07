import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
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
    example: 500,
    description: 'Bán kính check-in tối đa (mét)',
    default: 500,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  checkInRadius?: number;

  @ApiPropertyOptional({
    example: '08:00',
    description: 'Time when the place opens',
  })
  @IsString()
  @IsOptional()
  openTime?: string;

  @ApiPropertyOptional({
    example: '22:00',
    description: 'Time when the place closes',
  })
  @IsString()
  @IsOptional()
  closeTime?: string;

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

  @ApiProperty({ example: 'id-of-brand', description: 'ID of the brand' })
  @IsNotEmpty()
  brandId!: string;
}
