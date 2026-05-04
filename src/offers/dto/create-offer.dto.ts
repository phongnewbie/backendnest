import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({ example: 'Sale 50%', description: 'Title of the offer' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề ưu đãi không được để trống' })
  title!: string;

  @ApiPropertyOptional({
    example: 'Half price for all drinks',
    description: 'Offer description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'Only for dine-in',
    description: 'Terms and conditions',
  })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Valid from date',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  validFrom!: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Valid to date',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  validTo!: string;

  @ApiProperty({ example: 'uuid-of-place', description: 'ID of the place' })
  @IsUUID('4', { message: 'ID địa điểm không hợp lệ' })
  @IsNotEmpty()
  placeId!: string;
}
