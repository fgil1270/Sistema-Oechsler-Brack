import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreatePercentageDefinitionDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'numero de año'})
    year: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'Porcentaje de Meta'})
    value_objetive: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'Porcentaje de desempeñp personal'})
    value_performance: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'Personaje competencias y habilidades'})
    value_competence: number;
}

export class UpdatePercentageDefinitionDto extends PartialType(CreatePercentageDefinitionDto){

}