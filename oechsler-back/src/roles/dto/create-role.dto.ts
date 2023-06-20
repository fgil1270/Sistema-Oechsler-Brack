import { IsNotEmpty, IsString, IsNumber, IsUrl, IsEmail, Min, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre del rol' })
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Descripcion del rol' })
    readonly description: string;

}
