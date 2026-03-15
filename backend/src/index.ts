import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// DB 설정 (PostgreSQL)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  post: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'art_app',
});

// 테스트 API
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'DB Connection failed', error });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
});
