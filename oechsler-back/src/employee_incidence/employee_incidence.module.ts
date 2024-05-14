import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeIncidenceService } from './service/employee_incidence.service';
import {
  EmployeeIncidenceController,
  ReportEmployeeIncidenceController,
  ReportFlexTimeController,
} from './controller/employee_incidence.controller';
import { EmployeeIncidence } from './entities/employee_incidence.entity';
import { DateEmployeeIncidence } from './entities/date_employee_incidence.entity';
import { IncidenceCatologueModule } from '../incidence_catologue/incidence_catologue.module';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeShiftModule } from '../employee_shift/employee_shift.module';
import { EmployeeProfilesModule } from '../employee-profiles/employee-profiles.module';
import { ChecadorModule } from '../checador/checador.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { OrganigramaModule } from '../organigrama/organigrama.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeIncidence, DateEmployeeIncidence]),
    IncidenceCatologueModule,
    EmployeesModule,
    EmployeeShiftModule,
    EmployeeProfilesModule,
    forwardRef(() => ChecadorModule),
    PayrollsModule,
    OrganigramaModule,
    MailModule,
    UsersModule,
    CalendarModule,
  ],
  controllers: [
    EmployeeIncidenceController,
    ReportEmployeeIncidenceController,
    ReportFlexTimeController,
  ],
  providers: [EmployeeIncidenceService, EmployeeIncidence],
  exports: [EmployeeIncidenceService, EmployeeIncidence],
})
export class EmployeeIncidenceModule {}
