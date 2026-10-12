import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

export const sqlConfig: sql.config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '123123',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'nguyen_fashion',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: {
    instanceName: process.env.DB_INSTANCE && !process.env.DB_PORT ? process.env.DB_INSTANCE : undefined,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    encrypt: process.env.DB_ENCRYPT !== 'false',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    pool = await sql.connect(sqlConfig);
    console.log(`[SQL Server] Đã kết nối thành công đến database: ${sqlConfig.database} (${sqlConfig.server}\\${sqlConfig.options?.instanceName})`);
    return pool;
  } catch (err: any) {
    console.error('[SQL Server] Lỗi kết nối CSDL:', err.message);
    throw err;
  }
}

export async function checkSqlConnection(): Promise<{ connected: boolean; message: string; version?: string }> {
  try {
    const currentPool = await getPool();
    const result = await currentPool.request().query('SELECT @@VERSION as version, DB_NAME() as dbName');
    return {
      connected: true,
      message: `Đang kết nối database '${result.recordset[0].dbName}'`,
      version: result.recordset[0].version,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error.message,
    };
  }
}

export { sql };
