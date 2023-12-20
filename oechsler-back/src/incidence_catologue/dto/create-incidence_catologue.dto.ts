import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateIncidenceCatologueDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre de la incidencia' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Código de la incidencia' })
    code: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Codigo usado para identificarlo en reporte de nomina' })
    code_band: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Se puede aprobar doble?' })
    approval_double: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Requiere descripción?' })
    require_description: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Requiere rango de horas?' })
    require_range_hrs: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Es unico por día?' })
    unique_day: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Afecta al total de vacaciones?' })
    total_vacation: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Es medio día?' })
    half_day: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Se aprueba automáticamente?' })
    automatic_approval: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Afecta al total de horas?' })
    total_hours: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Aparece en el reporte de nomina?' })
    repor_nomina: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: '¿Requiere turno?' })
    require_shift: boolean;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Color de la requisición' })
    color: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Tipo afecta al total de horas' })
    affected_type:string;
}

export class UpdateIncidenceCatologueDto extends PartialType(CreateIncidenceCatologueDto) {}
