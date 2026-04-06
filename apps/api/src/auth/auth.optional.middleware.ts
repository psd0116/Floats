import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Optional auth middleware: sets req.userId if a valid token is present,
 * but does NOT reject the request if no token is provided.
 * Used for endpoints that work for both authenticated and anonymous users.
 */
export const optionalAuthMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token - proceed without userId
    return next();
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) return next();

  try {
    const decoded = jwt.verify(token, secret) as any;
    req.userId = decoded.userId;
  } catch (error) {
    // Invalid token - proceed without userId (don't reject)
  }

  next();
};
