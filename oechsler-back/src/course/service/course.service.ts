/*
https://docs.nestjs.com/providers#services
*/

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CourseDto } from '../dto/create_course.dto';
import { Course } from '../entities/course.entity';
import { CompetenceService } from '../../competence/service/competence.service';
import { TraininGoal } from '../entities/trainin_goal.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    private competenceService: CompetenceService,
    @InjectRepository(TraininGoal)
    private traininGoalRepository: Repository<TraininGoal>,
  ) {}

  async create(createCourseDto: CourseDto) {
    const courseNameExist = await this.courseRepository.findOne({
      where: {
        name: Like(`${createCourseDto.name}`),
      },
    });

    if (courseNameExist) {
      throw new BadRequestException(`El Curso ya existe`);
    }

    const competence = await this.competenceService.findOne(
      createCourseDto.competences,
    );
    const traininGoal = await this.getTraininGoalById(
      createCourseDto.traininGoal,
    );

    const course = this.courseRepository.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      status: createCourseDto.status,
      competence: competence,
      traininGoal: traininGoal,
    });

    return await this.courseRepository.save(course);
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      relations: {
        competence: true,
      },
      where: {
        id: id,
      },
    });

    return course;
  }

  async findAll() {
    const total = await this.courseRepository.count();
    const courses = await this.courseRepository.find({
      relations: {
        competence: true,
      },
      order: {
        name: 'ASC',
      },
    });

    if (!courses) {
      throw new NotFoundException(`Courses not found`);
    }
    return {
      total: total,
      courses: courses,
    };
  }

  //obtener lista de objetivos de entrenamiento
  async getTraininGoalAll() {
    const traininGoal = await this.traininGoalRepository.find({
      order: {
        name: 'ASC',
      },
    });

    return traininGoal;
  }

  //obtener objetivo de entrenamiento por id
  async getTraininGoalById(id: number) {
    const traininGoal = await this.traininGoalRepository.findOne({
      where: {
        id: id,
      },
    });

    return traininGoal;
  }

  //eliminar curso
  async delete(id: number) {
    const course = await this.courseRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!course) {
      throw new NotFoundException(`Course not found`);
    }

    return await this.courseRepository.softDelete(id);
  }
}
