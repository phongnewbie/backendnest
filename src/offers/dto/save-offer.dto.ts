import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SaveOfferDto {
  @ApiProperty({
    example: 'uuid-of-user',
    description: 'ID of the user saving the offer',
  })
  @IsUUID('4', { message: 'ID người dùng không hợp lệ' })
  @IsNotEmpty()
  userId!: string;
}
