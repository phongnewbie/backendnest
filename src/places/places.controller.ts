import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new place' })
  @ApiResponse({ status: 201, description: 'Place created' })
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all places' })
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a place by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a place' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a place' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.placesService.remove(id);
  }
}
