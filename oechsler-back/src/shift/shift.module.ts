import { Module } from '@nestjs/common';
import { ShiftService } from './service/shift.service';
import { ShiftController } from './controller/shift.controller';

@Module({
  controllers: [ShiftController],
  providers: [ShiftService]
})
export class ShiftModule {}
