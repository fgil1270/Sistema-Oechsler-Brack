import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTimeCorrectionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado' })
  id_employee: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Fecha de correción de tiempo' })
  date: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Aprobación de la correción de tiempo' })
  approved: boolean;

  @IsString()
  @ApiProperty({ description: 'Comentario de la correción de tiempo' })
  comment?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Id del empleado que crea la correción de tiempo',
  })
  created_by: number;
}

export class UpdateTimeCorrectionDto extends PartialType(
  CreateTimeCorrectionDto,
) { }

export class ReportTimeCorrectionDto {
  @IsString()
  @ApiProperty({ description: 'Fecha de inicio' })
  startDate: string;

  @IsString()
  @ApiProperty({ description: 'Fecha de fin' })
  endDate: string;

  @IsString()
  @ApiProperty({ description: 'tipo de empleado(Semanal, Quincenal)' })
  tipoEmpleado: string;

  @IsString()
  @ApiProperty({ description: 'Tipo de jerarquía del empleado (Normal, Jerarquia)' })
  tipoJerarquia: string;
}
