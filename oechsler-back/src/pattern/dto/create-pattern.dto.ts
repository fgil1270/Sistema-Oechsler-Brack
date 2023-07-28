import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreatePatternDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre del patrón de turnos' })
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'Emplame'})
    empalme: boolean;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Periodicidad en semanas' })
    periodicity: number;
}

export class UpdatePatternDto extends PartialType(CreatePatternDto) {}
