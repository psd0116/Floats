import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API 라우터 등록
app.use('/api', router);

app.listen(port, () => {
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
});
