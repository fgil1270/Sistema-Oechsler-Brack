/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CourseDto } from '../dto/create_course.dto';
import { Course } from '../entities/course.entity';
import { CompetenceService } from '../../competence/service/competence.service';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course) private courseRepository: Repository<Course>,
        private competenceService: CompetenceService
    ) {}

    async create(createCourseDto: CourseDto) {
        
        const courseNameExist = await this.courseRepository.findOne({
            where: {
                name: Like(`%${createCourseDto.name}%`)
            }
        });

        if (courseNameExist) {
            throw new BadRequestException(`El Curso ya existe`);
        }

        const competence = await this.competenceService.findOne(createCourseDto.competences);

        const course = this.courseRepository.create(createCourseDto);


        return await this.courseRepository.save(course);
    }

    async findOne(id: number) {
        const course = await this.courseRepository.findOne({
            relations: {
                competence: true
            },
            where: {
                id: id
            }
        });

        return course;
    }

    async findAll() {
        const total = await this.courseRepository.count();
        const courses = await this.courseRepository.find();
        
        if (!courses) {
            throw new NotFoundException(`Courses not found`);
        }
        return {
            total: total,
            courses: courses
        };
    }
}
