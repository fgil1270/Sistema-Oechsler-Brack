import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsPostalCode,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class RequestCourseDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id del empleado que solicita el curso' })
  requestBy: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del curso' })
  courseName: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ description: 'id del empleado' })
  employeeId: number[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Razon de la capacitación' })
  traininReason: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Prioridad de la capacitación' })
  priority: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Periodo de eficiencia' })
  efficiencyPeriod: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Costo del curso' })
  cost: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Moneda' })
  currency: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Tipo de curso(Interno, Externo)' })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Lugar del curso(Interno, Externo)' })
  place: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha tentativa de inicio' })
  tentativeDateStart: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha tentativa de fin' })
  tentativeDateEnd: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de aprobación del líder' })
  approved_at_leader: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de cancelación del líder' })
  canceled_at_leader: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de aprobación de RH' })
  approved_at_rh: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de cancelación de RH' })
  canceled_at_rh: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de aprobación del gerente' })
  approved_at_gm: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Fecha de cancelación del gerente' })
  canceled_at_gm: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Estatus del curso' })
  status: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'id del curso' })
  courseId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'id de la competencia' })
  competenceId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Origen de la solicitud de curso' })
  origin: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Herramienta de evaluación' })
  evaluation_tool: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Comentarios' })
  comment: string;
}

export class UpdateRequestCourseDto extends PartialType(RequestCourseDto) {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Evitar Aprobación' })
  avoidApprove: boolean;
}

export class RequestCourseAssignmentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id del curso' })
  courseId: number;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ description: 'id del empleado' })
  employeeId: number[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Dias de la semana' })
  day: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Fecha de inicio' })
  dateStart: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Fecha de fin' })
  dateEnd: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id del instructor' })
  teacherId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Tipo de curso (Interno, Externo)' })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Lugar del curso (Interno, Externo)' })
  place: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Estatus del curso' })
  status: string;

}

export class UpdateAssignmentCourseDto extends PartialType(RequestCourseAssignmentDto) {

}


