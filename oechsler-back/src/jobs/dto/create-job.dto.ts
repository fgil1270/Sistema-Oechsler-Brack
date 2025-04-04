import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
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
}

export class UpdateJobDto extends PartialType(CreateJobDto) {}
