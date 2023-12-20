import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { ShiftService } from './service/shift.service';
import { ShiftController } from './controller/shift.controller';
import { Shift } from './entities/shift.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shift
    ])
  ],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService]
})
export class ShiftModule {}
