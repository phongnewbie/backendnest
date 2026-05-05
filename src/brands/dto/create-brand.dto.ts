import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
    example: 'Coffee Shop',
    description: 'Brand category',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 'uuid-of-business',
    description: 'The ID of the business this brand belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  businessId!: string;
}
