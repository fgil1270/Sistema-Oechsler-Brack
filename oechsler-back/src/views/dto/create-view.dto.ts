import { IsNotEmpty, IsString, IsNumber, IsUrl, IsEmail, Min, MinLength } from "class-validator";
import { ApiProperty} from "@nestjs/swagger";

export class CreateViewDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre del la vista'})
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Url de la vista'})
    path: string;
}
