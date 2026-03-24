import type { Request } from 'express';

// Extend the Express Request type to include userId from auth middleware
export interface AuthenticatedRequest extends Request {
  userId: string;
}
