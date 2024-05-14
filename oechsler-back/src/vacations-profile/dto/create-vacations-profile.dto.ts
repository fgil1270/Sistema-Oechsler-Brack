import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateVacationsProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Código del perfil de vacaciones' })
  cv_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Descripción del perfil de vacaciones' })
  cv_description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Especial' })
  special: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Porcentaje de prima' })
  premium_percentage: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Días de vacaciones' })
  day: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Total de días de vacaciones' })
  total: number;
}

export class UpdateVacationsProfileDto extends PartialType(
  CreateVacationsProfileDto,
) {}
