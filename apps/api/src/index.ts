import dotenv from 'dotenv';
dotenv.config(); // Must be called before any module that reads process.env

import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API 라우터 등록
app.use('/api', router);

app.listen(port, () => {
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
});
