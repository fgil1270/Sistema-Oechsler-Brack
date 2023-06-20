import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule} from "@nestjs/config";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from "./enviroments";
import { RolesModule } from './roles/roles.module';
import { ModulesModule } from './modules/modules.module';
import { ViewsModule } from './views/views.module';
import config from "./config";


@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    DatabaseModule,
    RolesModule,
    ModulesModule,
    ViewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
