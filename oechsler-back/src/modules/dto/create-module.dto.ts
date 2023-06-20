import { IsNotEmpty, IsString, IsNumber, IsUrl, IsEmail, Min, MinLength } from "class-validator";
import { ApiProperty} from "@nestjs/swagger";

export class CreateModuleDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre del modulo'})
    name: string;
}
