import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateChecadaDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Id del empleado' })
  empleadoId?: number;

  @IsString()
  @ApiProperty({ description: 'Fecha de inicio' })
  startDate?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Fecha de fin' })
  endDate: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Numero de registro que proviene del checador' })
  numRegistroChecador?: number;

  @IsString()
  @ApiProperty({ description: 'Comentario' })
  comment?: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Id del empleado que crea el registro' })
  createdBy?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Hora de entrada' })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Hora de salida' })
  endTime: string;

  @IsString()
  @ApiProperty({ description: 'Estatus de la hora' })
  status: string;
}

export class UpdateChecadaDto extends PartialType(CreateChecadaDto) {}

export class FindChecadaDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Fecha de inicio' })
  startDate: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Fecha de fin' })
  endDate: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Hora de inicio' })
  hrEntrada: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Hora de fin' })
  hrSalida: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Tipo de organigrama' })
  type: string;
}
