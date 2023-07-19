import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { VacationsProfileService } from './service/vacations-profile.service';
import { VacationsProfileController } from './controller/vacations-profile.controller';
import { VacationsProfile } from "./entities/vacations-profile.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VacationsProfile
    ]),
  ],
  controllers: [VacationsProfileController],
  providers: [VacationsProfileService]
})
export class VacationsProfileModule {}
