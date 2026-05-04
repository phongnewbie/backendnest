import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({
    example: 'ACTA Corp',
    description: 'The name of the business',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

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
}
