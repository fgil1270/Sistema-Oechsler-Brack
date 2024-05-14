import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateShiftDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Código del turno' })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del turno' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Hora de entrada' })
  start_time: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Hora de salida' })
  end_time: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Días de la semana' })
  day: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Color del turno' })
  color: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Turno especial' })
  special: boolean;
}

export class UpdateShiftDto extends PartialType(CreateShiftDto) {}
