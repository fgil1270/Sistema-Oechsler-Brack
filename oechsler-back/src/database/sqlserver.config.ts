import * as sql from 'mssql';

export const dbConfig = {
  user: 'sa',
  password: 'Pq$$w0rd2025..!!',
  server: 'oe-que-pc-016',
  database: 'hikcentral',
  options: {
    encrypt: false, // Use this if you're on Windows Azure
    enableArithAbort: true,
  },
};

export const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));