import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { Segment } from '../prisma/generated';

@Injectable()
export class SegmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createSegmentDto: CreateSegmentDto): Promise<Segment> {
    return this.prisma.segment.create({
      data: createSegmentDto,
    });
  }

  async findAll(): Promise<Segment[]> {
    return this.prisma.segment.findMany({
      include: {
        _count: {
          select: { campaigns: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<Segment | null> {
    return this.prisma.segment.findUnique({
      where: { id },
      include: {
        campaigns: true,
      },
    });
  }

  async update(id: string, updateSegmentDto: UpdateSegmentDto): Promise<Segment> {
    return this.prisma.segment.update({
      where: { id },
      data: updateSegmentDto,
    });
  }

  async remove(id: string): Promise<Segment> {
    return this.prisma.segment.delete({
      where: { id },
    });
  }
}
