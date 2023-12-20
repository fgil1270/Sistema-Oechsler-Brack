import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrganigramaDto {
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'Puede evaluar' })
    evaluar: boolean; // puede evaluar o no

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado leader' })
    leader: number; // employee

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado' })
    employee: number; // employee
}

export class UpdateOrganigramaDto extends PartialType(CreateOrganigramaDto) {}

export class OrganigramaGerarquia {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Tipo de organigrama' })
    type: string;

    @IsString()
    @ApiProperty({ description: 'Fecha de Inicio' })
    startDate?: string; 

    @IsString()
    @ApiProperty({ description: 'Fecha Final' })
    endDate?: string;


}
