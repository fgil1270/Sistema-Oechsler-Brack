import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions:  DataSourceOptions= {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'db_oechsler_oits_test',
  logging: false,
  synchronize: false,
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

