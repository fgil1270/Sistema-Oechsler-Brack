import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty, PartialType} from "@nestjs/swagger";

export class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Codigo del departamento'})
    cv_code: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Descripción del departamento'})
    cv_description: string;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}


