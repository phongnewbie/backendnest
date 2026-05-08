import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { CreateBusinessWithUserDto } from './dto/create-business-with-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUserId } from '../auth/decorators/user-id.decorator';
import { GetUserRole } from '../auth/decorators/user-role.decorator';

@ApiTags('businesses')
@ApiBearerAuth()
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new business and its owner user (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'The business and user have been successfully created.',
  })
  create(@Body() createBusinessWithUserDto: CreateBusinessWithUserDto) {
    return this.businessesService.createWithUser(createBusinessWithUserDto);
  }

  @Get('my-business')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiOperation({ summary: 'Get current user business information' })
  async getMyBusiness(@GetUserId() userId: string) {
    return await this.businessesService.findByUserId(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses with pagination' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.businessesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business by ID' })
  async findOne(@Param('id') id: string) {
    return await this.businessesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiOperation({ summary: 'Update a business' })
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @GetUserId() userId: string,
    @GetUserRole() role: UserRole,
  ) {
    return await this.businessesService.update(
      id,
      updateBusinessDto,
      userId,
      role,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a business (Admin only)' })
  async remove(@Param('id') id: string) {
    return await this.businessesService.remove(id);
  }
}
