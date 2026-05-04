import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SaveOfferDto } from './dto/save-offer.dto';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiResponse({ status: 201, description: 'Offer created' })
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get('place/:placeId')
  @ApiOperation({ summary: 'Get all offers for a place' })
  findAllByPlace(@Param('placeId', ParseUUIDPipe) placeId: string) {
    return this.offersService.findAllByPlace(placeId);
  }

  @Post(':id/save')
  @ApiOperation({ summary: 'Save an offer for a user' })
  @ApiResponse({ status: 201, description: 'Offer saved' })
  saveOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() saveOfferDto: SaveOfferDto,
  ) {
    return this.offersService.saveOffer(saveOfferDto.userId, id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all saved offers for a user' })
  getUserOffers(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.offersService.getUserOffers(userId);
  }
}
