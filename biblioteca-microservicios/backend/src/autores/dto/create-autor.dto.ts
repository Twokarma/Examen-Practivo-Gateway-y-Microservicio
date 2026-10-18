import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAutorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  nacionalidad?: string;
}
