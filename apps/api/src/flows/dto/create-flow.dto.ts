import { IsString, IsNotEmpty, IsJSON, IsObject } from 'class-validator';

export class CreateFlowDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsNotEmpty()
  steps: any; // Using 'any' for now, can be a more specific class later
}
