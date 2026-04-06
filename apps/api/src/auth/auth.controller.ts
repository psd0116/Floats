import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { email, password, name, familyCode } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const result = await AuthService.signup(email, password, name, familyCode);
      res.status(201).json({ 
        message: 'User created successfully',
        ...result
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(error.message === 'User already exists' ? 400 : 500).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await AuthService.login(email, password);
      res.status(200).json({ 
        message: 'Login successful',
        ...result
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(error.message === 'Invalid credentials' ? 401 : 500).json({ error: error.message });
    }
  }

  static async getMe(req: any, res: Response) {
    try {
      const user = await AuthService.getUserById(req.userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(error.message === 'User not found' ? 404 : 500).json({ error: error.message });
    }
  }
}
