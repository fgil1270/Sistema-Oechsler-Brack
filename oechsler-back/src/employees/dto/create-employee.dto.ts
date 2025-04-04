import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateJobDto } from '../../jobs/dto/create-job.dto';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id de la nómina' })
  payRollId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del departamento' })
  departmentId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del perfil de vacaciones' })
  vacationProfileId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del perfil de empleado' })
  employeeProfileId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del puesto' })
  jobId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Trabajador' })
  worker: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Número de empleado' })
  employee_number: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Apellido paterno' })
  paternal_surname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Apellido materno' })
  maternal_surname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Género' })
  gender: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Fecha de nacimiento' })
  birthdate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'País' })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nacionalidad' })
  citizenship: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Estado' })
  state: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Ciudad' })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Colonia' })
  location: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'RFC' })
  rfc: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'CURP' })
  curp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'NSS' })
  nss: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Fecha de alta' })
  date_employment: Date;

  @IsString()
  @ApiProperty({ description: 'Fecha de baja' })
  work_term_date?: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Correo electrónico' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Teléfono' })
  phone?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Estado civil' })
  marital_status: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Salario' })
  salary: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Salario diario' })
  daily_salary: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Cotización' })
  quote: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Tipo de contrato' })
  type_contract: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Cuenta con Visa' })
  visa: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Cuenta con pasaporte' })
  fm_two: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Puede viajar' })
  travel: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Es brigadista' })
  brigade_member: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Estado del trabajador (Activo o Inactivo)' })
  worker_status: boolean;

}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  
}

export class findEmployeeProduccion {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Numero de Empleado' })
  employee_number: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Visible por produccion' })
  produccion_visible

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de nacimiento' })
  birthdate: string;
  
}
