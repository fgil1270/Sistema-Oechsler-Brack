import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsObject,
    IsPostalCode,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTeacherDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Nombre del instructor' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Apellido paterno del instructor' })
    paternal_surname: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Apellido materno del instructor' })
    maternal_surname: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Tipo (Interno, Externo)' })
    type: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Género del instructor' })
    gender: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'ID del proveedor' })
    supplierId: number;
}

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) { }