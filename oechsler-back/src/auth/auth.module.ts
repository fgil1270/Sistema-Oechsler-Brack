import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { LocalStrategy } from "./strategies/loca.strategy";
import { AuthService } from './services/auth.service';
import { UsersModule } from "../users/users.module";
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    UsersModule, 
    PassportModule, 
    JwtModule.register({
      secret: 'cambiar secret',
      signOptions: {
        expiresIn: '120s'
      }
    })
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
