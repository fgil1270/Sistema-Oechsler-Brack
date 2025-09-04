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
import { Transform } from 'class-transformer';

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

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Objetivo de la capacitación' })
  trainingObjective: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Prioridad de la capacitación' })
  priority: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Periodo de eficiencia en dias' })
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

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'id de la definición del objetivo anual' })
  definitionObjetiveAnnualId: number | null;
}

export class FindRequestCourseDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    // Si llega como string (query param), convertir a array
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value]; // Si no es JSON válido, crear array con el string
      }
    }
    return value;
  })
  @ApiProperty({ description: 'Array de status' })
  status: any[];

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
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Estatus del curso, no se desea buscar',
    type: [String],
  })
  no_status: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array de empleados a cambiar',
    type: [String],
  })
  changeEmployee: any[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Array de empleados a añadir',
    type: [String],
  })
  addEmployee: any[];

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Cambio de instructor',
    type: Object,
  })
  changeTeacher: { oldTeacher: number; newTeacher: number };
}


export class UploadFilesDto {
  classifications: string[];
}

export class RequestCourseAssessmentDto {
  @IsNumber()
  @ApiProperty({ description: 'Calificación pregunta uno' })
  value_uno: number;

  @IsNumber()
  @ApiProperty({ description: 'Calificación pregunta dos' })
  value_dos: number;

  @IsNumber()
  @ApiProperty({ description: 'Calificación pregunta tres' })
  value_tres: number;

  @IsString()
  @ApiProperty({ description: 'Comentarios' })
  comment: string;
}


