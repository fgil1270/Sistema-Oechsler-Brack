import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChecadorController } from './controller/checador.controller';
import { Checador } from './entities/checador.entity';
import { ChecadorService } from './service/checador.service';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Checador
    ]),
    EmployeesModule
  ],
  providers: [ChecadorService],
  controllers: [ChecadorController],
  exports: [ChecadorService]
})
export class ChecadorModule { }
