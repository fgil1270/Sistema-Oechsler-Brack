import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

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

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'No definido, Pendiente Evaluado medio año, Pendiente evaluador medio año, Pendiente evaluado Fin de año, Pendiente evaluador fin de año, Finalizado' })
    status?: string;

}

export class CreateEmployeeObjectiveDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'id del empleado' })
    idEmployee: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'id de los porcentajes por año' })
    idPercentageDefinition: number;

    @IsObject()
    @ApiProperty({ description: 'Objetivo de empleado' })
    employeeObjective: EmployeeObjectiveDto[];

}

export class UpdateEmployeeObjectiveDto extends PartialType(CreateEmployeeObjectiveDto){

}