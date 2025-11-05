import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTrainingDto {
    @ApiProperty({ description: 'Fecha de inicio del entrenamiento' })
    @IsString()
    @IsNotEmpty()
    start_date: Date;

    @ApiProperty({ description: 'Fecha de fin del entrenamiento' })
    @IsString()
    @IsNotEmpty()
    end_date: Date;

    @ApiProperty({ description: 'Estado del entrenamiento' })
    @IsString()
    @IsNotEmpty()
    status: string;
}

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) { }