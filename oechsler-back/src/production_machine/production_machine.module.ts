import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductionMachine } from '../production_machine/entities/production_machine.entity';
import { ProductionMachineService } from './service/production_machine.service';
import { ProductionMachineController } from './controller/production_machine.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionMachine]),
  ],
  controllers: [ProductionMachineController],
  providers: [ProductionMachineService],
  exports: [ProductionMachineService],
})
export class ProductionMachineModule { }
