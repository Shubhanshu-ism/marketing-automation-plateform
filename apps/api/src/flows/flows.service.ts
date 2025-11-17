import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../prisma/generated';

@Injectable()
export class FlowsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.FlowCreateInput) {
    return this.prisma.flow.create({ data });
  }

  findAll() {
    return this.prisma.flow.findMany();
  }

  findOne(id: string) {
    return this.prisma.flow.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.FlowUpdateInput) {
    return this.prisma.flow.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.flow.delete({ where: { id } });
  }
}
