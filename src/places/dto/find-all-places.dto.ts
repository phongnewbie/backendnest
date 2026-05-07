import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { BrandCategory } from '@prisma/client';

export class FindAllPlacesDto {
  @ApiPropertyOptional({ description: 'South-West Latitude' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  swLat?: number;

  @ApiPropertyOptional({ description: 'South-West Longitude' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  swLng?: number;

  @ApiPropertyOptional({ description: 'North-East Latitude' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  neLat?: number;

  @ApiPropertyOptional({ description: 'North-East Longitude' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  neLng?: number;

  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ enum: BrandCategory, description: 'Brand category' })
  @IsEnum(BrandCategory)
  @IsOptional()
  category?: BrandCategory;

  @ApiPropertyOptional({
    description: 'Filter places currently open',
    example: true,
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isOpenNow?: boolean;
}
