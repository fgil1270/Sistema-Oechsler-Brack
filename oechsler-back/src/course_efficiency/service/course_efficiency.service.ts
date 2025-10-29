import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  QueryRunner,
  FindOptionsWhere,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCourseEfficiencyDto, UpdateCourseEfficiencyDto } from '../dto/course_efficiency.dto';
import { CourseEfficiency } from '../entities/course_efficiency.entity';
import { CourseEfficiencyQuestion } from '../entities/course_efficiency_question.entity';
import { RequestCourseService } from '../../request_course/service/request_course.service';
import { EmployeesService } from '../../employees/service/employees.service';

@Injectable()
export class CourseEfficiencyService {
  constructor(
    @InjectRepository(CourseEfficiency) private courseEfficiencyRepository: Repository<CourseEfficiency>,
    @InjectRepository(CourseEfficiencyQuestion) private courseEfficiencyQuestionRepository: Repository<CourseEfficiencyQuestion>,
    private readonly requestCourseService: RequestCourseService,
    private readonly employeesService: EmployeesService,
  ) { }

  async create(createCourseEfficiencyDto: CreateCourseEfficiencyDto, user: any) {

    const leader = await this.employeesService.findOne(createCourseEfficiencyDto.leaderId);
    const employee = await this.employeesService.findOne(createCourseEfficiencyDto.employeeId);
    const requestCourse = await this.requestCourseService.findRequestCourseById(createCourseEfficiencyDto.requestCourseId);
    const createCourseEfficiency = this.courseEfficiencyRepository.create({
      date_evaluation: new Date(createCourseEfficiencyDto.evaluationDate),
      comment: createCourseEfficiencyDto.comment,
      comment_two: createCourseEfficiencyDto.commentTwo,
    });

    createCourseEfficiency.employee = employee.emp;
    createCourseEfficiency.evaluator = leader.emp;
    createCourseEfficiency.requestCourse = requestCourse;

    const courseEfficiency = await this.courseEfficiencyRepository.save(createCourseEfficiency);

    createCourseEfficiencyDto.courseEfficiencyQuestion.forEach(async (question) => {
      const createQuestion = this.courseEfficiencyQuestionRepository.create({
        question: question.question,
        calification: question.value,
        is_number: question.is_number,
        comment: question.comment,
        courseEfficiency: courseEfficiency,
      });

      await this.courseEfficiencyQuestionRepository.save(createQuestion);
    });

    //si no ha sido evaluado el empleado, cambiar estado a pendiente evaluar empleado
    if (requestCourse.request_course_assessment_employee != null) {
      requestCourse.status = 'Finalizado';
    } else {
      requestCourse.status = 'Pendiente Evaluar Empleado';
    }

    const updateDto: any = {
      status: requestCourse.status,
      requestCourseIds: [],
      avoidApprove: false,
      newEmployeeIds: [],
    };

    let updateRequestCourse = await this.requestCourseService.update(requestCourse.id, updateDto, user);

    return courseEfficiency;

  }

  async findAll() {
    return `This action returns all course-efficiencys`;
  }

  async findOne(id: number) {
    return `This action returns a #id course-efficiency`;
  }

  async update(id: number, updateCourseEfficiencyDto: UpdateCourseEfficiencyDto) {
    return `This action updates a #id course-efficiency`;
  }

  async remove(id: number) {
    return `This action removes a #id course-efficiency`;
  }
}
