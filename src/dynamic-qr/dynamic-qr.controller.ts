import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import { DynamicQrService } from './dynamic-qr.service';

@Controller('dynamic-qr')
export class DynamicQrController {
  constructor(private readonly dynamicQrService: DynamicQrService) {}

  @Get('generate')
  generate(@Query('placeId', ParseUUIDPipe) placeId: string) {
    return this.dynamicQrService.generateToken(placeId);
  }
}
