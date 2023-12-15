import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateLogAdjustmentVacationDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado' })
    id_empoyee: number;

    @IsNumber()
    @ApiProperty({ description: 'Id del leader' })
    id_leader?: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Valor anterior' })
    before_value: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Valor nuevo' })
    new_value: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Comentario' })
    comment: string;
}

export class UpdateLogAdjustmentVacationDto extends PartialType(CreateLogAdjustmentVacationDto) { }