import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CheckinsService } from './checkins.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { GetMyCheckinsDto } from './dto/get-my-checkins.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserId } from '../auth/decorators/user-id.decorator';
import { CheckinPaginationDto } from './dto/checkin-pagination.dto';

@ApiTags('checkins')
@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a standard check-in' })
  @ApiResponse({ status: 201, description: 'Check-in successful' })
  create(
    @Body() createCheckInDto: CreateCheckInDto,
    @GetUserId() userId: string | null,
  ) {
    return this.checkinsService.create(createCheckInDto, userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy lịch sử check-in của tôi (infinity scroll, filter ngày)',
  })
  findMyCheckins(
    @GetUserId() userId: string,
    @Query() query: GetMyCheckinsDto,
  ) {
    return this.checkinsService.findMyCheckins(userId, query);
  }

  @Get('place/:placeId')
  @ApiOperation({
    summary: 'Lấy danh sách check-in theo địa điểm (infinity scroll)',
  })
  findByPlace(
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Query() query: CheckinPaginationDto,
  ) {
    return this.checkinsService.findPaginated({ placeId, ...query });
  }
}
