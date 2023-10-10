import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateChecadaDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado' })
    empleadoId: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de registro' })
    fecha: string;

    @IsNumber()
    @ApiProperty({ description: 'Numero de registro que proviene del checador' })
    numRegistroChecador?:number;
}

export class UpdateChecadaDto extends PartialType(CreateChecadaDto) {}
