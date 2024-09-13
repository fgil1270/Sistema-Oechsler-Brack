import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class JobDocumentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Nombre del documento' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Ruta del documento' })
    route: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Id del trabajo' })
    jobId: number;

}