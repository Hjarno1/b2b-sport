// src/lib/db.ts
import { ConnectionPool } from 'mssql';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const config = {
  user: process.env.MSSQL_USER!,
  password: process.env.MSSQL_PASSWORD!,
  server: process.env.MSSQL_HOST!,
  port: Number(process.env.MSSQL_PORT ?? 1433),
  database: process.env.MSSQL_DATABASE!,
  options: {
    encrypt: true,
    trustServerCertificate: true, // Use true for local development
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

console.log({
  HOST: process.env.MSSQL_HOST,
  PORT: process.env.MSSQL_PORT,
  USER: process.env.MSSQL_USER,
  DATABASE: process.env.MSSQL_DATABASE,
});

// global singleton to avoid socket exhaustion
declare global {
  var __MSSQL_POOL__: Promise<ConnectionPool>;
}

const poolPromise: Promise<ConnectionPool> =
  global.__MSSQL_POOL__ ??
  (global.__MSSQL_POOL__ = new ConnectionPool(config)
    .connect()
    .then((pool) => {
      console.log('🟢 Connected to MSSQL');
      return pool;
    })
    .catch((err) => {
      console.error('🔴 MSSQL Connection Error:', err);
      throw err;
    }));

export { poolPromise as pool };
