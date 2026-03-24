import type { Request, Response } from 'express';
import { HealthService } from './health.service.js';

export class HealthController {
  static async getHealth(req: Request, res: Response) {
    try {
      const dbStatus = await HealthService.checkDbConnection();
      res.status(200).json(dbStatus);
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
