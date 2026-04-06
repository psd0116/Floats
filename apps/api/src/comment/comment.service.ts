import { prisma } from '../db/prisma.js';

export class CommentService {
  static async createComment(userId: string, artworkId: string, content: string) {
    // Sanitize: strip HTML tags to prevent XSS
    const sanitized = content.replace(/<[^>]*>/g, '').trim();
    if (!sanitized || sanitized.length === 0) {
      throw new Error('Comment content cannot be empty');
    }
    if (sanitized.length > 500) {
      throw new Error('Comment is too long (max 500 characters)');
    }

    return await prisma.comment.create({
      data: {
        content: sanitized,
        userId,
        artworkId,
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    });
  }

  static async getCommentsByArtworkId(artworkId: string) {
    return await prisma.comment.findMany({
      where: { artworkId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { name: true }
        }
      }
    });
  }
}
