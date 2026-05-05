import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({
    example: 'ACTA Corp',
    description: 'The name of the business',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'A leading tech company',
    description: 'Business description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'contact@acta.com',
    description: 'Business email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '+84123456789',
    description: 'Business phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: '123 Nguyen Hue, Dist 1, HCMC',
    description: 'Business address',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: 'https://acta.vn',
    description: 'Business website URL',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    example: 'https://minio.acta.vn/public/acta-logo.png',
    description: 'Business logo URL',
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
