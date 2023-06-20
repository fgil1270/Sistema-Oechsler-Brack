import { Module, Global, Inject } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from "../config";
import { ConfigType } from '@nestjs/config';

const API_KEY = '1234';
const API_KEY_PROD = 'PROD123456789';

@Global()
@Module({ 
    imports: [
        TypeOrmModule.forRootAsync({
            name: 'mysqlDB',
            inject: [config.KEY],
            useFactory: (configService: ConfigType<typeof config>) => {
                const { dbName, user, password, host, port } = configService.mysql;
                return {
                    type: 'mysql',
                    host,
                    port,
                    username: user,
                    password,
                    database: dbName,
                    synchronize: false,
                    autoLoadEntities: true,

                }
            },
        }),
    ],
    providers: [
        {
            provide: 'API_KEY',
            useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
        }
    ],
    exports:['API_KEY'],
})
export class DatabaseModule {}
