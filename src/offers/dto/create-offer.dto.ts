import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề ưu đãi không được để trống' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  validFrom: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  validTo: string;

  @IsUUID('4', { message: 'ID địa điểm không hợp lệ' })
  @IsNotEmpty()
  placeId: string;
}
