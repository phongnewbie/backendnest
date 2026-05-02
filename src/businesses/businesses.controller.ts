import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(
    @Body()
    data: {
      name: string;
      description?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.businessesService.create(data);
  }

  @Get()
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      description?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.businessesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }
}
