import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import { DynamicQrService } from './dynamic-qr.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('dynamic-qr')
@Controller('dynamic-qr')
export class DynamicQrController {
  constructor(private readonly dynamicQrService: DynamicQrService) {}

  @Get('generate')
  @ApiOperation({ summary: 'Generate a dynamic QR token for a place' })
  @ApiQuery({ name: 'placeId', type: 'string', required: true })
  generate(@Query('placeId', ParseUUIDPipe) placeId: string) {
    return this.dynamicQrService.generateToken(placeId);
  }
}
