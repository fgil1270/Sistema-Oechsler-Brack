import { IsNotEmpty, IsString, IsNumber, IsUrl, IsEmail, Min, MinLength, IsArray } from "class-validator";
import { PartialType, ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @ApiProperty({ description: 'User name' })
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'Password' })
    password: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'The email of user' })
    readonly email: string;

    @IsArray()
    @ApiProperty({ description: 'Roles' })
    rolesIds: number[];



}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
