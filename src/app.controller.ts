import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.health();
  }

  @Get('businesses')
  getBusinesses() {
    return this.appService.getBusinesses();
  }

  @Post('businesses')
  createBusiness(
    @Body() body: { name: string; brand: string; phone: string },
  ) {
    return this.appService.createBusiness(body);
  }

  @Patch('businesses/:id')
  updateBusiness(
    @Param('id') id: string,
    @Body() body: { name?: string; brand?: string; phone?: string },
  ) {
    return this.appService.updateBusiness(id, body);
  }

  @Delete('businesses/:id')
  deleteBusiness(@Param('id') id: string) {
    return this.appService.deleteBusiness(id);
  }

  @Get('locations')
  getLocations(@Query('businessId') businessId?: string) {
    return this.appService.getLocations(businessId);
  }

  @Post('locations')
  createLocation(
    @Body()
    body: {
      businessId: string;
      name: string;
      address: string;
      phone: string;
      openHours: string;
      latitude: number;
      longitude: number;
    },
  ) {
    return this.appService.createLocation(body);
  }

  @Patch('locations/:id')
  updateLocation(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      address?: string;
      phone?: string;
      openHours?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    return this.appService.updateLocation(id, body);
  }

  @Delete('locations/:id')
  deleteLocation(@Param('id') id: string) {
    return this.appService.deleteLocation(id);
  }

  @Get('reviews')
  getReviews(@Query('locationId') locationId?: string) {
    return this.appService.getReviews(locationId);
  }

  @Post('reviews')
  addReview(
    @Body() body: { locationId: string; author: string; rating: number; content: string },
  ) {
    return this.appService.addReview(body);
  }

  @Patch('reviews/:id/reply')
  replyReview(@Param('id') id: string, @Body() body: { reply: string }) {
    return this.appService.replyReview(id, body.reply);
  }

  @Post('checkins')
  addCheckIn(@Body() body: { locationId: string; lat: number; lng: number }) {
    return this.appService.addCheckIn(body);
  }

  @Get('stats')
  getStats(@Query('locationId') locationId?: string) {
    return this.appService.getStats(locationId);
  }
}
