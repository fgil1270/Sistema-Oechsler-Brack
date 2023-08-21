import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateEmployeeIncidenceDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado' })
    id_employee: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id de la incidencia' })
    id_incidence_catologue: number;

    @IsString()
    @ApiProperty({ description: 'Descripción de la incidencia' })
    description?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de inicio de la incidencia' })
    start_date: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de fin de la incidencia' })
    end_date: string;

    @IsNumber()
    @ApiProperty({ description: 'Total de horas' })
    total_hour?: number;

    @IsNumber()
    @ApiProperty({ description: 'Hora inicial' })
    start_hour?: string;

    @IsNumber()
    @ApiProperty({ description: 'Hora final' })
    end_hour?: string;

    @IsNumber()
    @ApiProperty({ description: 'id del leader que aprovo' })
    id_leader?: number;

    @IsString()
    @ApiProperty({ description: 'Fecha de aprobación por el leader' })
    date_aproved_leader?: string;

    @IsNumber()
    @ApiProperty({ description: 'id de rh que aprovo' })
    id_rh?: number;

    @IsString()
    @ApiProperty({ description: 'Fecha de aprobación por rh' })
    date_aproved_rh?: string; 
}

export class UpdateEmployeeIncidenceDto extends PartialType(CreateEmployeeIncidenceDto) {}