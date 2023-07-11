import { IsNotEmpty, IsString, IsNumber, IsUrl, IsEmail, Min, MinLength } from "class-validator";
import { PartialType, ApiProperty } from "@nestjs/swagger";

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

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
