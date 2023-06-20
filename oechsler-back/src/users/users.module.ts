import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { User } from './entity/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from './entity/role-user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserRole
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
