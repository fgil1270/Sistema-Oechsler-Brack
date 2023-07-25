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
