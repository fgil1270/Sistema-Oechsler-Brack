import { Module } from '@nestjs/common';
import { GeneralController } from './general.controller';

@Module({
  imports: [],
  controllers: [GeneralController,],
  providers: [],
  exports: []
})
export class GeneralModule { }
