import { Module } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';

@Module({
  controllers: [PayrollsController],
  providers: [PayrollsService]
})
export class PayrollsModule {}
