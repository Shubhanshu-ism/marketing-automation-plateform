import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CampaignStatus } from '../prisma/generated';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UsersService } from '../users/users.service';

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    @InjectQueue('campaign-jobs') private campaignJobsQueue: Queue,
  ) {}

  create(data: Prisma.CampaignCreateInput) {
    return this.prisma.campaign.create({ data });
  }

  findAll() {
    return this.prisma.campaign.findMany({ include: { flow: true } });
  }

  findOne(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: { flow: true, jobs: true },
    });
  }

  update(id: string, data: Prisma.CampaignUpdateInput) {
    return this.prisma.campaign.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }

  async start(id: string) {
    const campaign = await this.findOne(id);
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found.`);
    }

    // For now, we assume the audience is all users. This will be replaced by segmentation logic.
    const allUsers = await this.prisma.user.findMany();

    for (const user of allUsers) {
      // Create a job record in the database first
      const campaignJob = await this.prisma.campaignJob.create({
        data: {
          campaignId: campaign.id,
          userId: user.id,
          status: 'PENDING',
        },
      });

      // Then add the job to the queue, using the DB record's ID as the job ID
      await this.campaignJobsQueue.add(
        'process-campaign-message',
        {
          campaignId: campaign.id,
          userId: user.id,
        },
        {
          jobId: campaignJob.id,
        },
      );
    }

    // Update campaign status
    await this.update(id, { status: CampaignStatus.ACTIVE });

    return { message: `Campaign ${id} started for ${allUsers.length} users.` };
  }
}
