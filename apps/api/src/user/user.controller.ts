import type { Response } from 'express';
import { UserService } from './user.service.js';
import { prisma } from '../db/prisma.js';

export class UserController {
  static async getMyStats(req: any, res: Response) {
    try {
      const stats = await UserService.getMyStats(req.userId);
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getActivityCalendar(req: any, res: Response) {
    try {
      const calendar = await UserService.getActivityCalendar(req.userId);
      res.status(200).json(calendar);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBadges(req: any, res: Response) {
    try {
      const badges = await UserService.getBadges(req.userId);
      res.status(200).json(badges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFamilyMembers(req: any, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { familyCode: true }
      });
      if (!user) return res.status(404).json({ error: 'User not found' });
      const members = await UserService.getFamilyMembers(user.familyCode);
      res.status(200).json(members);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req: any, res: Response) {
    try {
      const { name, avatar } = req.body;
      const user = await UserService.updateProfile(req.userId, { name, avatar });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
