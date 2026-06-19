import { IsObject, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  type!: string;

  @IsObject()
  data!: any;
}