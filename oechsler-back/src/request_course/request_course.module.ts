import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestCourseController, AssignmentCourseController, RequestCourseDocumentController } from './controller/request_course.controller';
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
import { RequestCourseDocument } from './entities/request_course_document.entity';
import { RequestCourseAssessmentEmployee } from './entities/request_course_assessment_employee.entity';
import { MailModule } from '../mail/mail.module';
import { EmployeeObjectiveModule } from '../employee_objective/employee_objective.module';
import { UsersModule } from '../users/users.module';
import { EventRequestCourse } from './entities/event_request_course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestCourse, RequestCourseAssignment, RequestCourseDocument, RequestCourseAssessmentEmployee, EventRequestCourse]),
    CourseModule,
    DepartmentsModule,
    EmployeesModule,
    CompetenceModule,
    OrganigramaModule,
    SupplierModule,
    EmployeeIncidenceModule,
    MailModule,
    forwardRef(() => EmployeeObjectiveModule),
    UsersModule,
  ],
  providers: [RequestCourseService],
  controllers: [RequestCourseController, AssignmentCourseController, RequestCourseDocumentController],
  exports: [RequestCourseService],
})
export class RequestCourseModule { }
