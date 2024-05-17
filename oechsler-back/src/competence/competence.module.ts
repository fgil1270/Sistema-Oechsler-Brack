import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompetenceController } from './controller/competence.controller';
import { CompetenceService } from './service/competence.service';
import { Competence } from './entities/competence.entity';
import { TypeCompetence } from './entities/type_competence.entity';
import { TypeElementCompetence } from './entities/type_element_competence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Competence,
      TypeCompetence,
      TypeElementCompetence,
    ]),
  ],
  controllers: [CompetenceController],
  providers: [CompetenceService],
  exports: [CompetenceService],
})
export class CompetenceModule {}
