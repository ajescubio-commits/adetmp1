
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LostItemService } from './lost_item.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lost_items')
export class LostItemController {
  constructor(private lostItemService: LostItemService) {}


  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.lostItemService.getAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.lostItemService.findById(+id);
  }

  
  @Post()
  async create(@Body() body: any) {
    return this.lostItemService.createLostItem(body);
  }

  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.lostItemService.updateLostItem(+id, body);
  }

  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.lostItemService.deleteLostItem(+id);
  }
}
