/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseService } from './service/course.service';
import { CourseController } from './controller/course.controller';
import { Course } from './entities/course.entity';
import { CompetenceModule } from '../competence/competence.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course]),
        CompetenceModule
    ],
    controllers: [
        CourseController, CourseController],
    providers: [
        CourseService, CourseService],
})
export class CourseModule { }
