import { getPool, sql } from './sqlClient.js';

export async function initializeSqlState(initial: string): Promise<string> {
  const pool = await getPool();
  await pool.request().query(`
    IF OBJECT_ID('dbo.application_state', 'U') IS NULL
      CREATE TABLE dbo.application_state (id INT PRIMARY KEY, payload NVARCHAR(MAX) NOT NULL,
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(), CHECK (ISJSON(payload)=1));
    IF OBJECT_ID('dbo.account_carts', 'U') IS NULL
      CREATE TABLE dbo.account_carts (user_id VARCHAR(36) PRIMARY KEY,
        payload NVARCHAR(MAX) NOT NULL, updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CHECK (ISJSON(payload)=1));
  `);
  await pool.request().input('payload', sql.NVarChar(sql.MAX), initial).query(`
    IF NOT EXISTS (SELECT 1 FROM dbo.application_state WHERE id=1)
      INSERT INTO dbo.application_state (id,payload) VALUES (1,@payload);
  `);
  const result = await pool.request().query('SELECT payload FROM dbo.application_state WHERE id=1');
  return result.recordset[0].payload;
}

export async function writeSqlState(payload: string): Promise<void> {
  const pool = await getPool();
  await pool.request().input('payload', sql.NVarChar(sql.MAX), payload)
    .query('UPDATE dbo.application_state SET payload=@payload, updated_at=SYSUTCDATETIME() WHERE id=1');
}
