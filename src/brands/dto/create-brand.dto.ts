import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BrandCategory } from '@prisma/client';

export class CreateBrandDto {
  @ApiProperty({ example: 'Brand X', description: 'The name of the brand' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'Brand logo URL',
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'A premium brand',
    description: 'Brand description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: BrandCategory,
    example: BrandCategory.COFFEE,
    description: 'Brand category',
  })
  @IsEnum(BrandCategory)
  @IsOptional()
  category?: BrandCategory;

  @ApiProperty({
    example: 'id-of-business',
    description: 'The ID of the business this brand belongs to',
  })
  @IsNotEmpty()
  businessId!: string;
}
