import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class EnabledCreateIncidenceDto {
    @IsString()
    @ApiProperty()
    date: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    enabled: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Tipo de nomina' })
    type: string;
      
    

}