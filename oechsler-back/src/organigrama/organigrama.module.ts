import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrganigramaService } from './service/organigrama.service';
import { OrganigramaController } from './controller/organigrama.controller';
import { Organigrama } from './entities/organigrama.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { VacationsProfileModule } from '../vacations-profile/vacations-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organigrama
    ]),
    forwardRef(() => EmployeesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [OrganigramaController],
  providers: [OrganigramaService],
  exports: [OrganigramaService]
})
export class OrganigramaModule {}
