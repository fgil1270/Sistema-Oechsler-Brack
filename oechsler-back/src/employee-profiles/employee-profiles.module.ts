import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeProfilesService } from './service/employee-profiles.service';
import { EmployeeProfilesController } from './controller/employee-profiles.controller';
import { EmployeeProfile } from "./entities/employee-profile.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeProfile
    ]),
  ],
  controllers: [EmployeeProfilesController],
  providers: [EmployeeProfilesService]
})
export class EmployeeProfilesModule {}
