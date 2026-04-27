import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProccessEvaluationService } from './service/proccess-evaluation.service';
import { ProccessEvaluationController } from './controller/proccess-evaluation.controller';
import { ProccessEvaluation } from './entities/proccess-evaluation.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProccessEvaluation]),
    EmployeesModule
  ],
  controllers: [ProccessEvaluationController],
  providers: [ProccessEvaluationService],
  exports: [ProccessEvaluationService]
})
export class ProcessEvaluationModule { }
