import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyReviewDto {
  @ApiProperty({
    example: 'Thank you for your review!',
    description: 'Reply content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
