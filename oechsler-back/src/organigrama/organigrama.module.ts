import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrganigramaService } from './service/organigrama.service';
import { OrganigramaController } from './controller/organigrama.controller';
import { Organigrama } from './entities/organigrama.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organigrama
    ]),
    EmployeesModule,
    UsersModule
  ],
  controllers: [OrganigramaController],
  providers: [OrganigramaService],
  exports: [OrganigramaService]
})
export class OrganigramaModule {}
