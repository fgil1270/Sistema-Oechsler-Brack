import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestCourseController, AssignmentCourseController } from './controller/request_course.controller';
import { RequestCourse } from './entities/request_course.entity';
import { RequestCourseAssignment } from './entities/request_course_assignment.entity';
import { RequestCourseService } from './service/request_course.service';
import { CourseModule } from '../course/course.module';
import { DepartmentsModule } from '../departments/departments.module';
import { EmployeesModule } from '../employees/employees.module';
import { CompetenceModule } from '../competence/competence.module';
import { OrganigramaModule } from '../organigrama/organigrama.module'; 
import { SupplierModule } from '../supplier/supplier.module';
import { EmployeeIncidenceModule } from '../employee_incidence/employee_incidence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestCourse, RequestCourseAssignment]),
    CourseModule,
    DepartmentsModule,
    EmployeesModule,
    CompetenceModule,
    OrganigramaModule,
    SupplierModule,
    EmployeeIncidenceModule,
  ],
  providers: [RequestCourseService],
  controllers: [RequestCourseController, AssignmentCourseController],
  exports: [RequestCourseService],
})
export class RequestCourseModule {}
