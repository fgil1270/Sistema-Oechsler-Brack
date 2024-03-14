import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeesModule } from '../employees/employees.module';
import { Competence } from '../competence/entities/competence.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Employee,
      Competence
    ]),
    EmployeesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
