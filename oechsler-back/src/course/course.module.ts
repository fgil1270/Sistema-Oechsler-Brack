/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseService } from './service/course.service';
import { CourseController } from './controller/course.controller';
import { Course } from './entities/course.entity';
import { CompetenceModule } from '../competence/competence.module';
import { TraininGoal } from './entities/trainin_goal.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course, TraininGoal]),
        CompetenceModule
    ],
    controllers: [
        CourseController
    ],
    providers: [
        CourseService
    ],
    exports: [
        CourseService
    ]
})
export class CourseModule { }
