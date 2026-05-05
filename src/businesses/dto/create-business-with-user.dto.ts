import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessWithUserDto {
  @ApiProperty({
    example: 'ACTA Corp',
    description: 'The name of the business',
  })
  @IsString()
  @IsNotEmpty()
  businessName!: string;

  @ApiProperty({
    example: 'Nguyễn Văn B',
    description: 'The full name of the business owner',
  })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    example: '0902222222',
    description: 'The phone number for login and contact',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: 'owner@acta.com',
    description: 'The email to receive login information',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({
    example: 'A leading tech company',
    description: 'Business description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
