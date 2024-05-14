import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsEmail,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateViewDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del la vista' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Descripción de la vista' })
  description: string;
}

export class UpdateViewDto extends PartialType(CreateViewDto) {}
