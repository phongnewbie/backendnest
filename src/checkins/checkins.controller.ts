import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { DynamicCheckInDto } from './dto/dynamic-checkin.dto';

@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkinsService.create(createCheckInDto);
  }

  @Post('dynamic')
  createDynamic(@Body() dynamicCheckInDto: DynamicCheckInDto) {
    return this.checkinsService.createDynamic(dynamicCheckInDto);
  }

  @Get()
  findAllByPlace(@Query('placeId', ParseUUIDPipe) placeId: string) {
    return this.checkinsService.findAllByPlace(placeId);
  }
}
