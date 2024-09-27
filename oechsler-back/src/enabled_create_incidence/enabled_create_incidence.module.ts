/*
https://docs.nestjs.com/modules
*/
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnabledCreateIncidenceService } from './service/enabled-create-incidence.service';
import { EnabledCreateIncidenceController } from './controller/enabled-create-incidence.controller';
import { EnabledCreateIncidence } from './entities/enabled-create-incidence.entity';
import { EmployeesModule } from '../employees/employees.module';
import { PayrollsModule } from 'src/payrolls/payrolls.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([EnabledCreateIncidence]),
        EmployeesModule,
        PayrollsModule
    ],
    controllers: [EnabledCreateIncidenceController],
    providers: [EnabledCreateIncidenceService],
    exports: [EnabledCreateIncidenceService],
})
export class EnabledCreateIncidenceModule {}
