import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class DocumentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre de la clasificacion de documentos' })
    name: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ description: 'Nombre de la clasificacion de documentos' })
    required: boolean;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Nombre de la clasificacion de documentos' })
    documentClasificationId: number;
}

export class UpdateDocumentDto extends PartialType(DocumentDto) {}