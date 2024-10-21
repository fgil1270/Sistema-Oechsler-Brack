import { Module, Global, Inject } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';
import { ConfigType } from '@nestjs/config';

const API_KEY = '1234';
const API_KEY_PROD = 'PROD123456789';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbName, user, password, host, port } = configService.mssql;
        return {
          type: 'mysql',
          host: host,
          port: port,
          username: user,
          password: password,
          database: dbName,
          synchronize: false,
          autoLoadEntities: true,
          entities: ['dist/**/*.entity.ts'],
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
  ],

  exports: ['API_KEY', TypeOrmModule],
})
export class DatabaseModule {}
