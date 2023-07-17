import { IsNotEmpty, IsString, IsBoolean } from "class-validator";
import { ApiProperty, PartialType} from "@nestjs/swagger";

export class CreateJobDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Codigo del puesto'})
    cv_code: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Nombre del puesto'})
    cv_name: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'Indica si el puesto es de lider de turno'})
    shift_leader: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'Indica si el puesto puede ver plc'})
    plc: boolean;

}

export class UpdateJobDto extends PartialType(CreateJobDto) {}
