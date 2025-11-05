import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Training } from './entities/training.entity';
import { TrainingService } from './service/training.service';
import { TrainingController } from './controller/training.controller';
import { TrainingMachineModule } from '../training_machine/training_machine.module';
import { TrainingMachine } from '../training_machine/entities/training_machine.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeesModule } from '../employees/employees.module';
import { FileTraining } from './entities/file-training.entity';
import { HistoryTraining } from './entities/history-training.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Training, TrainingMachine, Employee, FileTraining, HistoryTraining]),
    TrainingMachineModule,
    EmployeesModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService]
})
export class TrainingModule { }
