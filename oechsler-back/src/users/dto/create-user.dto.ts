import { IsNotEmpty, IsString, IsNumber, IsUrl, IsEmail, Min, MinLength } from "class-validator";
import { PartialType, ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @ApiProperty({ description: 'User name' })
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Password' })
    password: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'The email of user' })
    readonly email: string;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
