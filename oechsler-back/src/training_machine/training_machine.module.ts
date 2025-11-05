import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingMachine } from './entities/training_machine.entity';
import { TrainingMachineController } from './controller/training-machine.controller';
import { TrainingMachineService } from './service/training-machine.service';
import { ProductionArea } from '../production_area/entities/production_area.entity';
import { ProductionAreaModule } from '../production_area/production_area.module';
import { CompetenceMachine } from './entities/competence_machine.entity';
import { CompetenceModule } from '../competence/competence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingMachine, ProductionArea, CompetenceMachine]),
    ProductionAreaModule,
    CompetenceModule,
  ],
  controllers: [TrainingMachineController],
  providers: [TrainingMachineService],
  exports: [TrainingMachineService],
})
export class TrainingMachineModule { }
