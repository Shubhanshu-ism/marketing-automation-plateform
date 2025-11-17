import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateSegmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  filters: Record<string, any>; // e.g., {"location": "NYC", "signupDate": ">2024-01-01"}
}
