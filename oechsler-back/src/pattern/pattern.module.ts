import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatternService } from './service/pattern.service';
import { PatternController } from './controller/pattern.controller';
import { Pattern } from './entities/pattern.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pattern])],
  controllers: [PatternController],
  providers: [PatternService],
  exports: [PatternService],
})
export class PatternModule {}
