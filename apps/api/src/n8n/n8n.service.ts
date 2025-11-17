import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private readonly httpClient: AxiosInstance;
  private readonly webhookBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.webhookBaseUrl = this.configService.get<string>('N8N_WEBHOOK_URL') || 'http://localhost:5678/webhook';
    this.httpClient = axios.create({
      baseURL: this.webhookBaseUrl,
      timeout: 5000,
    });
  }

  /**
   * Trigger job failure alert workflow in n8n
   */
  async triggerJobFailureAlert(payload: {
    jobId: string;
    campaignId: string;
    userId: string;
    error: any;
  }): Promise<void> {
    try {
      this.logger.log(`Triggering job failure alert for job ${payload.jobId}`);
      await this.httpClient.post('/job-failure', payload);
      this.logger.log(`Successfully triggered job failure alert`);
    } catch (error) {
      this.logger.error(`Failed to trigger job failure alert: ${error.message}`);
      // Don't throw error - n8n webhook failure shouldn't break the main flow
    }
  }

  /**
   * Trigger campaign completion notification
   */
  async triggerCampaignComplete(payload: {
    campaignId: string;
    totalJobs: number;
    successCount: number;
    failureCount: number;
  }): Promise<void> {
    try {
      this.logger.log(`Triggering campaign complete notification for campaign ${payload.campaignId}`);
      await this.httpClient.post('/campaign-complete', payload);
      this.logger.log(`Successfully triggered campaign complete notification`);
    } catch (error) {
      this.logger.error(`Failed to trigger campaign complete notification: ${error.message}`);
    }
  }

  /**
   * Generic webhook trigger
   */
  async triggerWebhook(path: string, payload: any): Promise<any> {
    try {
      this.logger.log(`Triggering webhook: ${path}`);
      const response = await this.httpClient.post(path, payload);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to trigger webhook ${path}: ${error.message}`);
      throw error;
    }
  }
}
