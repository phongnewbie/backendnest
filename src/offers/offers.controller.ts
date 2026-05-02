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

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get('place/:placeId')
  findAllByPlace(@Param('placeId', ParseUUIDPipe) placeId: string) {
    return this.offersService.findAllByPlace(placeId);
  }

  @Post(':id/save')
  saveOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.offersService.saveOffer(userId, id);
  }

  @Get('user/:userId')
  getUserOffers(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.offersService.getUserOffers(userId);
  }
}
