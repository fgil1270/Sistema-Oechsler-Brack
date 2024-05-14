import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CompetenceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Area donde debera cumplirse el objetivo' })
  area: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Meta/Objetivo/Asignación' })
  goal: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Forma en que sera evaluado el objetivo' })
  calculation: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Procentaje' })
  percentage: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Comentarios' })
  comment: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'No definido, Pendiente Evaluado medio año, Pendiente evaluador medio año, Pendiente evaluado Fin de año, Pendiente evaluador fin de año, Finalizado',
  })
  status?: string;
}

export class UpdateCompetenceDto extends PartialType(CompetenceDto) {}
