import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class DefinitionObjectiveAnnualDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado' })
  idEmployee: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del leader' })
  idLeader: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del porcentaje' })
  idPercentageDefinition: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Estado de la asignacion de objetivos, No definido, Pendiente Evaluado medio año, Pendiente evaluador medio año,' +
    'Pendiente evaluado Fin de año, Pendiente evaluador fin de año, Finalizado' })
  status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Comentario de edicion' })
  comment_edit?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Rango de calificacion medio año empleado' })
  half_year_employee_range?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Calificacion medio año empleado' })
  half_year_employee_value?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Comentario medio año empleado' })
  half_year_employee_comment?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Rango de calificacion fin año empleado' })
  end_year_employee_range?: string;


}

export class UpdateDefinitionObjectiveAnnualDto extends PartialType(DefinitionObjectiveAnnualDto) {}

export class UpdateDefinitionObjectiveAnnualEvaluadtionLeaderDto extends PartialType(DefinitionObjectiveAnnualDto) {
  @IsArray()
  @ApiProperty({ description: 'Objetivo de empleado' })
  dataObjective: any[];

  @IsArray()
  @ApiProperty({ description: 'Competencias de empleado' })
  dataCompetence: any[];

  @IsArray()
  @ApiProperty({ description: 'Competencias de empleado asignadas manualmente' })
  dataCompetenceManual: any[];

  @IsArray()
  @ApiProperty({ description: 'Desempeño personal' })
  dataPerformance: any[];

  @IsArray()
  @ApiProperty({ description: 'Crear Desempeño personal' })
  createPerformance: any[];
}


export class EmployeeObjectiveDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Area donde debera cumplirse el objetivo' })
  area: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Meta/Objetivo/Asignación' })
  goal: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Forma en que sera evaluado el objetivo' })
  calculation: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Procentaje' })
  percentage: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Comentarios' })
  comment: string;

  @IsString()
  @ApiProperty({
    description:
      'No definido, Pendiente Evaluado medio año, Pendiente evaluador medio año, Pendiente evaluado Fin de año, Pendiente evaluador fin de año, Finalizado',
  })
  status?: string;
}

export class UpdateObjectiveDTO extends PartialType(EmployeeObjectiveDto) {
  @IsNumber()
  @ApiProperty({ description: 'Id del objectivo si ya esta creado' })
  id?: number;
}

export class DncCourseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Razón de capacitación' })
  train: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Prioridad(Menos de 3 meses, 3 a 6 meses, 6 a 12 meses)',
  })
  priority: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Comentarios' })
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id del curso' })
  idCourse: number;
}

export class UpdateDncCourseDto extends PartialType(DncCourseDto) {
  @IsNumber()
  @ApiProperty({ description: 'Id del dnc si ya esta creado' })
  id?: number;
}

export class DncCourseManualDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Meta a desarrollar' })
  goal: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Razón de capacitación' })
  train: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Prioridad(Menos de 3 meses, 3 a 6 meses, 6 a 12 meses)',
  })
  priority: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Comentarios' })
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id de la competencia' })
  idCompetence: number;
}

export class UpdateDncCourseManualDto extends PartialType(DncCourseManualDto) {
  @IsNumber()
  @ApiProperty({ description: 'Id del dncManual si ya esta creado' })
  id?: number;
}

export class CompetenceEvaluationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Tipo de asignacion(Manual, Puesto)' })
  type: string;

  @ApiProperty({ description: 'Calificación medio año' })
  value_half_year?: number;

  @IsString()
  @ApiProperty({ description: 'Comentario medio año' })
  comment_half_year?: string;

  @ApiProperty({ description: 'Calificación fin de año' })
  value_end_year?: number;

  @IsString()
  @ApiProperty({ description: 'Comentario fin de año' })
  comment_end_year?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id de la competencia' })
  idCompetence: number;
}

export class UpdateCompetenceEvaluationDto extends PartialType(CompetenceEvaluationDto) {}

export class CreateEmployeeObjectiveDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'id de la asignacion de objetivos anual si existe',
  })
  idObjectiveAnnual?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id del empleado' })
  idEmployee: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id de los porcentajes por año' })
  idPercentageDefinition: number;

  @IsArray()
  @ApiProperty({ description: 'Objetivo de empleado' })
  employeeObjective: EmployeeObjectiveDto[];

  @IsArray()
  @ApiProperty({ description: 'Cursos de empleado' })
  dncCourse: DncCourseDto[];

  @IsArray()
  @ApiProperty({ description: 'Cursos manuales de empleado' })
  dncCourseManual: DncCourseManualDto[];

  @IsArray()
  @ApiProperty({ description: 'Evaluacion de competencias' })
  competenceEvaluation: CompetenceEvaluationDto[];

  @IsOptional()
  @ApiProperty({ description: 'Saltar evaluacion medio año' })
  skipMidYearEvaluation?: boolean;
}

export class UpdateEmployeeObjectiveDto extends PartialType(CreateEmployeeObjectiveDto) {}

export class CreateEmployeeObjectiveDtoParcial {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id del empleado' })
  idEmployee: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id de los porcentajes por año' })
  year: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({ description: 'Objetivo de empleado' })
  employeeObjective: EmployeeObjectiveDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ description: 'Cursos de empleado' })
  dncCourse: DncCourseDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ description: 'Cursos manuales de empleado' })
  dncCourseManual: DncCourseManualDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ description: 'Evaluacion de competencias' })
  competenceEvaluation: CompetenceEvaluationDto;
}

export class UpdateEmployeeObjectiveDtoPartial extends PartialType(CreateEmployeeObjectiveDtoParcial) {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Id de la asignacion de objetivos anual' })
  id: number;
}


