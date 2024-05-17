import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePercentageDefinitionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'numero de año' })
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Porcentaje de Meta' })
  value_objetive: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Porcentaje de desempeñp personal' })
  value_performance: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Personaje competencias y habilidades' })
  value_competence: number;
}

export class UpdatePercentageDefinitionDto extends PartialType(
  CreatePercentageDefinitionDto,
) {}
