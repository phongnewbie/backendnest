import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: 'Rating from 0 to 5',
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0, { message: 'Đánh giá thấp nhất là 0 sao' })
  @Max(5, { message: 'Đánh giá cao nhất là 5 sao' })
  @IsNotEmpty({ message: 'Số sao không được để trống' })
  rating!: number;

  @ApiPropertyOptional({
    example: 'Great place!',
    description: 'Review content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/review.jpg'],
    description: 'Review images',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'uuid-of-user', description: 'ID of the user' })
  @IsUUID('4', { message: 'ID người dùng không hợp lệ' })
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'uuid-of-place', description: 'ID of the place' })
  @IsUUID('4', { message: 'ID địa điểm không hợp lệ' })
  @IsNotEmpty()
  placeId!: string;
}
