import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCourseEfficiencyDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del curso' })
    courseId: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado' })
    employeeId: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del leader' })
    leaderId: number;
}

export class UpdateCourseEfficiencyDto extends PartialType(CreateCourseEfficiencyDto) {
  
}