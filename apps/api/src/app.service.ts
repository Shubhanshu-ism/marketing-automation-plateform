import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Checks the health of the application, including the database connection.
   * @returns A promise that resolves to an object with the status of the API and the database.
   */
  async getHealth(): Promise<{ api: string; db: string }> {
    try {
      // The $queryRaw`SELECT 1` is a lightweight query to check if the database is reachable.
      await this.prisma.$queryRaw`SELECT 1`;
      return { api: 'ok', db: 'ok' };
    } catch (e) {
      this.logger.error('Health check failed:', e);
      return { api: 'ok', db: 'error' };
    }
  }
}
