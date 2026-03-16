import { Router } from 'express';
import { HealthController } from '../controllers/health.controller.js';

export const router = Router();

router.get('/health', HealthController.getHealth);
