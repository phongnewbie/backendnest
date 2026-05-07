import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/mock-data';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
    status: 201,
    description: 'The brand has been successfully created.',
  })
  async create(
    @Body() createBrandDto: CreateBrandDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.brandsService.create(createBrandDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  async findAll() {
    return await this.brandsService.findAll();
  }

  @Get('my-brands')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all brands of the current business with pagination',
  })
  async findMyBrands(
    @Query() paginationDto: PaginationDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.brandsService.findMyBrands(req.user.sub, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand by ID' })
  async findOne(@Param('id') id: string) {
    return await this.brandsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a brand' })
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.brandsService.update(id, updateBrandDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a brand' })
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.brandsService.remove(id, req.user.sub);
  }
}
