/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogAdjustmentVacationService } from './service/log_adjustment_vacation.service';
import { LogAdjustmentVacationController } from './controller/log_adjustment_vacation.controller';
import { LogAdjustmentVacation } from './entities/log_adjustment_vacation.entity';
import { EmployeesModule } from '../employees/employees.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            LogAdjustmentVacation
        ]),
        EmployeesModule
    ],
    controllers: [ LogAdjustmentVacationController ],
    providers: [ LogAdjustmentVacationService ],
    exports: [ LogAdjustmentVacationService ]
})
export class LogAdjustmentVacationModule { }
