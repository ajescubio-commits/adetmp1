
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('claims')
export class ClaimsController {
  constructor(private claimsService: ClaimsService) {}

  // Get all claims
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.claimsService.getAll();
  }

  // Get claim by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.claimsService.findById(+id);
  }

  // Add new claim
  @Post()
  async create(@Body() body: any) {
    return this.claimsService.createClaim(body);
  }

  // Update claim
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.claimsService.updateClaim(+id, body);
  }

  // Delete claim
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.claimsService.deleteClaim(+id);
  }
}
