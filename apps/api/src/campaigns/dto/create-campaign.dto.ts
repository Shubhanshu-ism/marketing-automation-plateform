import { IsString, IsNotEmpty, IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { CampaignStatus } from '../../prisma/generated';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  flowId: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
