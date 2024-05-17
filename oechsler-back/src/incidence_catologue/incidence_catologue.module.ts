import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncidenceCatologueService } from './service/incidence_catologue.service';
import { IncidenceCatologueController } from './controller/incidence_catologue.controller';
import { IncidenceCatologue } from './entities/incidence_catologue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncidenceCatologue])],
  controllers: [IncidenceCatologueController],
  providers: [IncidenceCatologueService],
  exports: [IncidenceCatologueService],
})
export class IncidenceCatologueModule {}
