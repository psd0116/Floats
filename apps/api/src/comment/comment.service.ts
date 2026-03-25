import { prisma } from '../db/prisma.js';

export class CommentService {
  static async createComment(userId: string, artworkId: string, content: string) {
    return await prisma.comment.create({
      data: {
        content,
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
