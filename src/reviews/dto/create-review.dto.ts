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
  @IsNumber()
  @Min(0, { message: 'Đánh giá thấp nhất là 0 sao' })
  @Max(5, { message: 'Đánh giá cao nhất là 5 sao' })
  @IsNotEmpty({ message: 'Số sao không được để trống' })
  rating: number;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsUUID('4', { message: 'ID người dùng không hợp lệ' })
  @IsNotEmpty()
  userId: string;

  @IsUUID('4', { message: 'ID địa điểm không hợp lệ' })
  @IsNotEmpty()
  placeId: string;
}
