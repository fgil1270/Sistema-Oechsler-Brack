import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FindChecadaDto } from '../../checador/dto/create-checada.dto';

export class CreateTrainingDto {
    @ApiProperty({ description: 'Fecha de inicio del entrenamiento' })
    @IsString()
    @IsNotEmpty()
    start_date: Date;

    @ApiProperty({ description: 'Fecha de fin del entrenamiento' })
    @IsString()
    @IsNotEmpty()
    end_date: Date;

    @ApiProperty({ description: 'Estado del entrenamiento (Proceso, Pendiente, Finalizado, Cancelado)' })
    @IsOptional()
    @IsString()
    status: string;

    @ApiProperty({ description: 'ID del empleado que imparte el entrenamiento' })
    @IsNumber()
    @IsNotEmpty()
    employeeTrainerId: number;

    @ApiProperty({ description: 'ID de la máquina utilizada en el entrenamiento' })
    @IsNumber()
    @IsNotEmpty()
    trainingMachineId: number;

    @ApiProperty({ description: 'ID del empleado que recibe el entrenamiento' })
    @IsNumber()
    @IsNotEmpty()
    employeeId: number;
}

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) { }

export class SearchTrainingDto {
    @ApiProperty({ description: 'Array de IDs del entrenamiento' })
    @IsOptional()
    @IsNumber({}, { each: true })
    id: number[];

    @ApiProperty({ description: 'Array de status' })
    @IsOptional()
    @IsString({ each: true })
    status: string[];


}