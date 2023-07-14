import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";

import { LocalStrategy } from "./strategies/loca.strategy";
import { JWTStrategy } from "./strategies/jwt.strategy";
import { AuthService } from './services/auth.service';
import { UsersModule } from "../users/users.module";
import { RolesModule } from "../roles/roles.module";
import { AuthController } from './controllers/auth.controller';
import config from "../config";

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    RolesModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          global: true,
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '12h'
          }
        };
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JWTStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
