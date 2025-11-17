import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Public endpoint for tracking events (e.g., pixel tracking, webhooks)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  // Protected endpoints for analytics
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('userId') userId?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.eventsService.findAll(userId, campaignId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Query('campaignId') campaignId?: string) {
    return this.eventsService.getEventStats(campaignId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}
