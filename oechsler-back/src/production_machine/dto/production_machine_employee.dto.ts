import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductionMachineEmployeeDto {

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'ID de la máquina de producción', example: 1 })
    productionMachineId: number;

    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ description: 'IDs de los empleados asignados a la máquina', example: [1, 2, 3] })
    employeeIds: number[];

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de inicio de la asignación', example: '2024-01-01' })
    start_date: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de fin de la asignación', example: '2024-01-31' })
    end_date: string;
}

export class SearchProductionMachineEmployeeDto extends PartialType(CreateProductionMachineEmployeeDto) { }