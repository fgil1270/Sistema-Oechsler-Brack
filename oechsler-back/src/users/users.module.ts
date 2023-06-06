import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from "@nestjs/typeorm";



@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
