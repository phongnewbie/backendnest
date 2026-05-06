import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';

export class UpdatePlaceDto extends PartialType(
  OmitType(CreatePlaceDto, ['brandId'] as const),
) {}
