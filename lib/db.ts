import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
});

export async function saveNFSeCount(quant: number, period: string) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO public.nfse_count (quant, period) VALUES ($1, $2)',
      [quant, period]
    );
  } finally {
    client.release();
  }
}

export async function getNFSeCountInRange(startDate: string, endDate: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT SUM(quant) as total FROM public.nfse_count WHERE period BETWEEN $1 AND $2',
      [startDate, endDate]
    );
    return result.rows[0].total || 0;
  } finally {
    client.release();
  }
}