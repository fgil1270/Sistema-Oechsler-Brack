import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();
const mysqlUser = process.env.MYSQL_USER;
const mysqlRootPassword = process.env.MYSQL_ROOT_PASSWORD;
const mysqlDatabase = process.env.MYSQL_DATABASE;

export const dataSourceOptions:  DataSourceOptions= {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: mysqlUser,
  password: mysqlRootPassword,
  database: mysqlDatabase,
  logging: false,
  synchronize: false,
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

