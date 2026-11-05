
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FoundItemService } from './found_item.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('found_items')
export class FoundItemController {
  constructor(private foundItemService: FoundItemService) {}

  // Get all found items
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.foundItemService.getAll();
  }

  // Get found item by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.foundItemService.findById(+id);
  }

  // Add found item
  @Post()
  async create(@Body() body: any) {
    return this.foundItemService.createFoundItem(body);
  }

  // Update found item
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.foundItemService.updateFoundItem(+id, body);
  }

  // Delete found item
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.foundItemService.deleteFoundItem(+id);
  }
}
