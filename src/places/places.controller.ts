import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FindAllPlacesDto } from './dto/find-all-places.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/mock-data';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new place' })
  @ApiResponse({ status: 201, description: 'Place created' })
  async create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.placesService.create(createPlaceDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all places with GeoJSON and map filtering' })
  async findAll(@Query() query: FindAllPlacesDto) {
    return await this.placesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a place by ID' })
  async findOne(@Param('id') id: string) {
    return await this.placesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a place' })
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.placesService.update(id, updatePlaceDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a place' })
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.placesService.remove(id, req.user.sub);
  }
}
