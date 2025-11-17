import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from '../prisma/generated';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  async findAll(userId?: string, campaignId?: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        ...(userId && { userId }),
        ...(campaignId && { campaignId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit results for performance
    });
  }

  async findOne(id: string): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async getEventStats(campaignId?: string) {
    const where = campaignId ? { campaignId } : {};
    
    const stats = await this.prisma.event.groupBy({
      by: ['type'],
      where,
      _count: {
        type: true,
      },
    });

    return stats.map(stat => ({
      type: stat.type,
      count: stat._count.type,
    }));
  }
}
