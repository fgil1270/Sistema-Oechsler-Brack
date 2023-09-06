import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateEmployeeIncidenceDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Id del empleado' })
    id_employee: any;

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

    @IsString()
    @ApiProperty({ description: 'Hora inicial' })
    start_hour?: string;

    @IsString()
    @ApiProperty({ description: 'Hora final' })
    end_hour?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'id del leader que aprovo' })
    id_leader?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Fecha de aprobación por el leader' })
    date_aproved_leader?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'id de rh que aprovo' })
    id_rh?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Fecha de aprobación por rh' })
    date_aproved_rh?: string; 

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Estatus de la incidencia' })
    status?: string;
}

export class UpdateEmployeeIncidenceDto extends PartialType(CreateEmployeeIncidenceDto) {}