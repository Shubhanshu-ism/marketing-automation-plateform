import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '../prisma/generated';
import { Logger } from '@nestjs/common';

@Processor('campaign-jobs')
export class JobsProcessor extends WorkerHost {
  private readonly logger = new Logger(JobsProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    this.logger.debug('Job data:', job.data);

    const { campaignId, userId } = job.data;

    // 1. Update job status to PROCESSING
    await this.prisma.campaignJob.update({
      where: { id: job.id },
      data: { status: JobStatus.PROCESSING, processedAt: new Date() },
    });

    try {
      // 2. Simulate sending a message
      this.logger.log(`Simulating sending message to user ${userId} for campaign ${campaignId}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // 3. Update job status to SENT on success
      await this.prisma.campaignJob.update({
        where: { id: job.id },
        data: { status: JobStatus.SENT, result: { success: true } },
      });

      this.logger.log(`Job ${job.id} completed successfully.`);

    } catch (error) {
      this.logger.error(`Job ${job.id} failed`, error.stack);
      // 4. Update job status to FAILED on error
      await this.prisma.campaignJob.update({
        where: { id: job.id },
        data: { status: JobStatus.FAILED, result: { success: false, error: error.message } },
      });
      throw error; // Re-throw error to let BullMQ handle retry logic if configured
    }
  }
}
