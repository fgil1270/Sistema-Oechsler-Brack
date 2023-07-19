import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { PayrollsService } from './service/payrolls.service';
import { PayrollsController } from './controller/payrolls.controller';
import { Payroll } from "./entities/payroll.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payroll
    ]),
  ],
  controllers: [PayrollsController],
  providers: [PayrollsService]
})
export class PayrollsModule {}
