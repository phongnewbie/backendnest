import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetCheckinsDto {
  @ApiProperty({ example: 'uuid-of-place', description: 'ID of the place' })
  @IsUUID('4', { message: 'ID địa điểm không hợp lệ' })
  @IsNotEmpty({ message: 'ID địa điểm không được để trống' })
  placeId!: string;

  @ApiPropertyOptional({
    example: 'uuid-of-last-checkin',
    description:
      'Cursor for pagination (ID of the last item from previous page)',
  })
  @IsUUID('4', { message: 'Cursor không hợp lệ' })
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}
