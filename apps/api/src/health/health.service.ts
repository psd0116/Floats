import { prisma } from '../db/prisma.js';

export class HealthService {
  static async checkDbConnection() {
    try {
      // Execute a simple query using Prisma's $queryRaw to check the DB connection
      const result = await prisma.$queryRaw`SELECT NOW()`;
      return { status: 'ok', db_time: (result as any[])[0].now };
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('DB Connection failed');
    }
  }
}
