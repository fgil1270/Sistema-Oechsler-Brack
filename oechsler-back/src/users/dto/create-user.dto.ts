import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsEmail,
  Min,
  MinLength,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

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

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado' })
  employee: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Requiere renovar contraseña' })
  renewPass: boolean;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
