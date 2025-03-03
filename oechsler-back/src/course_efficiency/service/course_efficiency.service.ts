import { Injectable } from '@nestjs/common';
import { CreateCourseEfficiencyDto, UpdateCourseEfficiencyDto } from '../dto/course_efficiency.dto';

@Injectable()
export class CourseEfficiencyService {
  create(createCourseEfficiencyDto: CreateCourseEfficiencyDto) {
    return 'This action adds a new course-efficiency';
  }

  findAll() {
    return `This action returns all course-efficiencys`;
  }

  findOne(id: number) {
    return `This action returns a #id course-efficiency`;
  }

  update(id: number, updateCourseEfficiencyDto: UpdateCourseEfficiencyDto) {
    return `This action updates a #id course-efficiency`;
  }

  remove(id: number) {
    return `This action removes a #id course-efficiency`;
  }
}
