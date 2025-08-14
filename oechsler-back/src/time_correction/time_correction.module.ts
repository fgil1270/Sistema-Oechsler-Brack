import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimeCorrectionController } from './controller/time_correction.controller';
import { TimeCorrection } from './entities/time_correction.entity';
import { TimeCorrectionService } from './service/time_correction.service';
import { EmployeeIncidenceModule } from '../employee_incidence/employee_incidence.module';
import { EmployeeIncidence } from '../employee_incidence/entities/employee_incidence.entity';
import { MailModule } from '../mail/mail.module';
import { EmployeeShiftModule } from '../employee_shift/employee_shift.module';
import { IncidenceCatologueModule } from '../incidence_catologue/incidence_catologue.module';
import { EmployeesModule } from '../employees/employees.module';
import { ChecadorModule } from '../checador/checador.module';
import { OrganigramaModule } from '../organigrama/organigrama.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeCorrection, EmployeeIncidence]),
    MailModule,
    EmployeeIncidenceModule,
    EmployeeShiftModule,
    IncidenceCatologueModule,
    EmployeesModule,
    forwardRef(() => ChecadorModule),
    OrganigramaModule,
    CalendarModule,
  ],
  providers: [TimeCorrectionService],
  controllers: [TimeCorrectionController],
  exports: [TimeCorrectionService],
})
export class TimeCorrectionModule { }
