import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductionMachineDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre de la máquina de producción', example: 'Máquina 1' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Descripción de la máquina de producción', example: 'Máquina para ensamblaje' })
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Número total de empleados asignados a la máquina', example: 5 })
    total_employees: number;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'Estado activo de la máquina de producción', example: true })
    is_active: boolean;

}

export class UpdateProductionMachineDto extends PartialType(
    CreateProductionMachineDto
) { }
