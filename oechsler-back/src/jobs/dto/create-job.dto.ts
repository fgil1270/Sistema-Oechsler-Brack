import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Codigo del puesto' })
  cv_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del puesto' })
  cv_name: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indica si el puesto es visuble para el lider de turno',
  })
  shift_leader: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Indica si el puesto es visible por plc' })
  plc: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Es visible por produccion' })
  produccion_visible: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Indica si el puesto esta activo' })
  active: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    description: 'ID de la descripción de puesto asociada',
    required: false,
  })
  jobDescriptionId?: number;
}

export class UpdateJobDto extends PartialType(CreateJobDto) { }
