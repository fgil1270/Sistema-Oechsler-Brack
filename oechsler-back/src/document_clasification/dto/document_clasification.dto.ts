import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class DocumentClasificationDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre de la clasificacion de documentos' })
    name: string;
}

export class UpdateDocumentClasificationDto extends PartialType(DocumentClasificationDto) {}