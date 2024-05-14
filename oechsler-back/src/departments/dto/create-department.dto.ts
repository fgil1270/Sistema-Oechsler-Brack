import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Codigo del departamento' })
  cv_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Descripción del departamento' })
  cv_description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Centro de Costo' })
  cc: number;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
