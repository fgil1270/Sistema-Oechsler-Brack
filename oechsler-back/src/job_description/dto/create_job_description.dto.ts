import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Any } from 'typeorm';
import { Competence } from '../../competence/entities/competence.entity';

export class StudyDto {

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'ID del estudio', example: 1, required: false })
    id?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Grado de estudio', example: 'Ingenieria Industrial' })
    estudio: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Dominio del grado', example: 'Avanzado' })
    domain: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Tipo de estudio', example: 'Licenciatura' })
    type: string;
}

export class ExperienceAreaDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'ID del area de experiencia', example: 1, required: false })
    id?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Area de experiencia', example: 'Inyeccion de plastico' })
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Anios de experiencia en el area', example: 3 })
    year: number;
}

export class EstructuraOrganizacionalDto {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        description: 'Puestos que le reportan al puesto actual',
        example: [2, 5],
        required: false,
        type: [Number],
    })
    idJobReportan?: number[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        description: 'Puestos a los que brinda apoyo el puesto actual',
        example: [7, 9],
        required: false,
        type: [Number],
    })
    idApoya?: number[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({
        description: 'Puestos que pueden apoyar al puesto actual por ausencia',
        example: [11],
        required: false,
        type: [Number],
    })
    idApoyado?: number[];

    @IsNumber()
    @ApiProperty({ description: 'ID del puesto líder asociado al puesto actual', example: 3 })
    idJobLeader: number;
}
export class ResponsibilityDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'ID de la responsabilidad', example: 1, required: false })
    id?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Descripcion de la responsabilidad', example: 'Planear la produccion semanal.' })
    responsibility: string;
}

export class InteractionDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'ID de la interaccion', example: 1, required: false })
    id?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Descripcion de la interaccion', example: 'Colaboracion con el area de calidad para asegurar los estandares.' })
    name: string;
}

export class AuthorizationDto {
    @IsNumber()
    @ApiProperty({ description: 'ID del empleado autorizador como Lider', example: 1 })
    leader: number;

    @IsNumber()
    @ApiProperty({ description: 'ID del empleado autorizador como Jefe de Area', example: 2 })
    manager: number;

    @IsNumber()
    @ApiProperty({ description: 'ID del empleado autorizador como RH', example: 3 })
    rh: number;
}

export class CompetenceDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'ID de la competencia', example: 1, required: false })
    idcompetencia?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre de la competencia', example: 'Liderazgo' })
    nameCompetencia: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Dominio de la competencia', example: 'Avanzado' })
    domain?: string;
}

export class CreateJobDescriptionDto {
    @IsNumber()
    @ApiProperty({ description: 'ID del puesto', example: 1 })
    jobId: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre del puesto', example: 'Gerente de Produccion' })
    jobName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Tipo de empleado', example: 'Administrativo' })
    employeeType: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Area del puesto', example: 1 })
    area: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre del departamento', example: 'Produccion' })
    areaName: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({ description: 'Fecha de edicion', example: '2026-04-06T00:00:00.000Z' })
    editDate: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Descripcion general del puesto', example: 'Responsable de planear y coordinar la produccion.' })
    description: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponsibilityDto)
    @ApiProperty({
        description: 'Responsabilidades del puesto',
        type: [ResponsibilityDto],
    })
    responsibilities: ResponsibilityDto[];

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => EstructuraOrganizacionalDto)
    @ApiProperty({
        description: 'Estructura organizacional asociada al puesto',
        required: false,
        type: EstructuraOrganizacionalDto,
    })
    estructuraOrganizacional?: EstructuraOrganizacionalDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InteractionDto)
    @ApiProperty({
        description: 'Interacciones del puesto con otras areas',
        example: ['Colaboracion con el area de calidad para asegurar los estandares.'],
        type: [InteractionDto],
    })
    interactions: InteractionDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StudyDto)
    @ApiProperty({
        description: 'Estudios requeridos para el puesto',
        type: [StudyDto],
    })
    estudios: StudyDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CompetenceDto)
    @ApiProperty({
        description: 'Competencias requeridas para el puesto',
        example: [{ id: 1, nameCompetencia: 'Liderazgo' }, { id: 2, nameCompetencia: 'Analisis de datos' }],
        type: [CompetenceDto],
    })
    competencias: CompetenceDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExperienceAreaDto)
    @ApiProperty({
        description: 'Areas con experiencia requerida para el puesto',
        type: [ExperienceAreaDto],
    })
    experienceAreas: ExperienceAreaDto[];

    @IsObject()
    @ValidateNested()
    @Type(() => AuthorizationDto)
    @ApiProperty({
        description: 'Autorizadores del job description',
        required: false,
        type: AuthorizationDto,
    })
    authorization?: AuthorizationDto;
}
