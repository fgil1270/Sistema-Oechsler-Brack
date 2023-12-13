import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { VacationsProfileService } from './service/vacations-profile.service';
import { VacationsProfileController } from './controller/vacations-profile.controller';
import { VacationsProfile } from "./entities/vacations-profile.entity";
import { VacationsProfileDetail } from "./entities/vacations-profile-detail.entity";
import { VacationsProfileSpecial } from './entities/vacations-profile-special.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VacationsProfile,
      VacationsProfileDetail,
      VacationsProfileSpecial
    ]),
  ],
  controllers: [VacationsProfileController],
  providers: [VacationsProfileService],
  exports: [VacationsProfileService]
})
export class VacationsProfileModule {}
