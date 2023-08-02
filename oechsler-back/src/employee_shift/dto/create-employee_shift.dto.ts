import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEmployeeShiftDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado' })
    employeeId: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del turno' })
    shiftId: number;

    @IsNumber()
    @ApiProperty({ description: 'Id del patrón de turnos' })
    patternId?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de inicio' })
    start_date: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de fin' })
    end_date: string;
}

export class UpdateEmployeeShiftDto extends PartialType(CreateEmployeeShiftDto) {}
