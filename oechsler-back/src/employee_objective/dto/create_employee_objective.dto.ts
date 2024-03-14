import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateEmployeeObjectiveDto {
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

}

export class UpdateEmployeeObjectiveDto extends PartialType(CreateEmployeeObjectiveDto){

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
    @ApiProperty({ description: 'No definido, Pendiente Evaluado medio año, Pendiente evaluador medio año, Pendiente evaluado Fin de año, Pendiente evaluador fin de año, Finalizado' })
    status?: string;

}

export class DncCourseDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Razón de capacitación' })
    train: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Prioridad(Menos de 3 meses, 3 a 6 meses, 6 a 12 meses)' })
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
    @ApiProperty({ description: 'Prioridad(Menos de 3 meses, 3 a 6 meses, 6 a 12 meses)' })
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