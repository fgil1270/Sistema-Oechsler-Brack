import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions:  DataSourceOptions= {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'db_oechsler',
  logging: false,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

