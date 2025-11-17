import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  type: string; // "email_opened", "link_clicked", "form_submitted"

  @IsObject()
  metadata: Record<string, any>;

  @IsString()
  @IsOptional()
  campaignId?: string;
}
