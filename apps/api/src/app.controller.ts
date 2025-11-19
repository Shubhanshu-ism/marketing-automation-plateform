import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Provides a health check endpoint for monitoring and uptime checks.
   * It returns the status of the API and its database connection.
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async getHealth(): Promise<{ api: string; db: string }> {
    return this.appService.getHealth();
  }
}
