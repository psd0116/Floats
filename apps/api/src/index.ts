import dotenv from 'dotenv';
dotenv.config(); // Must be called before any module that reads process.env

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { router } from './routes/index.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '5mb' })); // Reduced DB JSON limit

// Apply rate limiting (Max 150 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 150, 
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);


// API 라우터 등록
app.use('/api', router);

app.listen(port, () => {
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
});
