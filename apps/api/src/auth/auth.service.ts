import { prisma } from '../db/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start safely.');
  }
  return process.env.JWT_SECRET;
};

export class AuthService {
  static async signup(email: string, password: string, name?: string, familyCode?: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a new family code if not provided
    const finalFamilyCode = familyCode || Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        familyCode: finalFamilyCode,
      },
    });

    const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, name: user.name, familyCode: user.familyCode } };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, name: user.name, familyCode: user.familyCode } };
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, familyCode: true, createdAt: true }
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
