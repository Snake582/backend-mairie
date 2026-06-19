import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;

   @IsOptional()
  @IsString()
  adresse!: string;

   @IsOptional()
  @IsString()
  photo!: string;

   @IsOptional()
  @IsString()
  numeroCni!: string;

}