import { Module } from '@nestjs/common';
import { VacationsProfileService } from './service/vacations-profile.service';
import { VacationsProfileController } from './vacations-profile.controller';

@Module({
  controllers: [VacationsProfileController],
  providers: [VacationsProfileService]
})
export class VacationsProfileModule {}
