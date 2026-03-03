import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobDescription } from './entities/job_description.entity';
import { JobActivity } from './entities/job_activities.entity';
import { JobReportHim } from './entities/job_report_him.entity';
import { JobHelp } from './entities/job_help.entity';
import { JobAbsenceDelegate } from './entities/job_absence_delegate.entity';
import { JobAreaExperience } from './entities/job_area_experience.entity';
import { JobDegree } from './entities/job_degree.entity';
import { JobInteractionArea } from './entities/job_interaction_area.entity';


@Module({
  imports: [TypeOrmModule.forFeature([JobDescription, JobActivity, JobReportHim, JobHelp, JobAbsenceDelegate, JobInteractionArea, JobDegree, JobAreaExperience])],
  controllers: [],
  providers: [],
  exports: []
})
export class JobDescriptionModule { }
