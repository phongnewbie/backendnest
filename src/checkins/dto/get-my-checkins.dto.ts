import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetMyCheckinsDto {
  @ApiPropertyOptional({
    example: 'uuid-of-last-checkin',
    description: 'Cursor từ trang trước',
  })
  @IsUUID('4')
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    example: '2026-05-01',
    description: 'Lọc từ ngày (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    example: '2026-05-31',
    description: 'Lọc đến ngày (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  to?: string;
}
