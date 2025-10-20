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

export class CreateSupplierDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Nombre del negocio' })
    business_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Nombre del proveedor' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Código del proveedor' })
    code: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'RFC del proveedor' })
    rfc: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Teléfono del proveedor' })
    phone: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Calle del proveedor' })
    street: string;

}
