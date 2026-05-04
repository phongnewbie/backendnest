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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('checkins')
@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a standard check-in' })
  @ApiResponse({ status: 201, description: 'Check-in successful' })
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkinsService.create(createCheckInDto);
  }

  @Post('dynamic')
  @ApiOperation({ summary: 'Create a dynamic check-in via QR' })
  @ApiResponse({ status: 201, description: 'Dynamic check-in successful' })
  createDynamic(@Body() dynamicCheckInDto: DynamicCheckInDto) {
    return this.checkinsService.createDynamic(dynamicCheckInDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all check-ins for a place' })
  @ApiQuery({ name: 'placeId', type: 'string', required: true })
  findAllByPlace(@Query('placeId', ParseUUIDPipe) placeId: string) {
    return this.checkinsService.findAllByPlace(placeId);
  }
}
