import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEmployeeProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Código del perfil del empleado' })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del perfil del empleado' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Tiempo de retardo' })
  delay_time: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Horas por semana' })
  work_week_hrs: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Horas por turno' })
  work_shift_hrs: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Limite de horas extra' })
  over_time_limit: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Dias de la semana' })
  work_days: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Aplicar horas extra' })
  apply_extra_hrs: boolean;
}

export class UpdateEmployeeProfileDto extends PartialType(
  CreateEmployeeProfileDto,
) {}
