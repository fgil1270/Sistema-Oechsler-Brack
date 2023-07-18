import { Module } from '@nestjs/common';
import { EmployeeProfilesService } from './employee-profiles.service';
import { EmployeeProfilesController } from './employee-profiles.controller';

@Module({
  controllers: [EmployeeProfilesController],
  providers: [EmployeeProfilesService]
})
export class EmployeeProfilesModule {}
