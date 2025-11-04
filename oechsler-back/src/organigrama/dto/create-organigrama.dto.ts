import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrganigramaDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Puede evaluar' })
  evaluar: boolean; // puede evaluar o no

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado leader' })
  leader: number; // employee

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado' })
  employee: number; // employee
}

export class UpdateOrganigramaDto extends PartialType(CreateOrganigramaDto) { }

export class OrganigramaGerarquia {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Tipo de busqueda normal o jerarquia' })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de Inicio' })
  startDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha Final' })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Necesita datos del usuario que esta logueado' })
  needUser?: boolean;
}

export class SearchOrganigramaDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Puede evaluar' })
  evaluar: boolean; // puede evaluar o no

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado leader' })
  leader: number; // employee

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado' })
  employee: number; // employee

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Buscar por departamento' })
  byDepartment?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Buscar por departamento del director' })
  byDepartmentDirector?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Tipo de busqueda normal o jerarquia' })
  type: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Necesita datos del usuario que esta logueado' })
  needUser?: boolean;

}

