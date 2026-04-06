import { prisma } from '../db/prisma.js';
import { S3Service } from '../aws/s3.service.js';

export class ArtworkService {
  static async getAllArtworks(filters: { familyCode?: string; isPublic?: boolean } = {}) {
    const where: any = {};
    
    if (filters.isPublic) {
      where.isPublic = true;
    } else if (filters.familyCode) {
      where.user = { familyCode: filters.familyCode };
    }

    return await prisma.artwork.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, familyCode: true }
        }
      }
    });
  }

  static async getArtworksByUserId(userId: string) {
    return await prisma.artwork.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createArtwork(userId: string, data: { title: string; thumbnail: string; tags?: string[]; isPublic?: boolean }) {
    return await prisma.artwork.create({
      data: {
        title: data.title,
        thumbnail: data.thumbnail,
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        userId
      }
    });
  }

  static async getArtworkById(id: string) {
    return await prisma.artwork.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, familyCode: true }
        }
      }
    });
  }

  static async deleteArtwork(id: string, userId: string) {
    const artwork = await prisma.artwork.findUnique({ where: { id } });
    if (!artwork) throw new Error('Artwork not found');
    if (artwork.userId !== userId) throw new Error('Not authorized');
    
    // Delete S3 image if it exists
    if (artwork.thumbnail && artwork.thumbnail.includes('s3.')) {
      try {
        await S3Service.deleteImage(artwork.thumbnail);
      } catch (err) {
        console.error('Failed to delete S3 object (proceeding with DB delete):', err);
      }
    }

    // 댓글 먼저 삭제 후 작품 삭제
    await (prisma.comment as any).deleteMany({ where: { artworkId: id } });
    return await prisma.artwork.delete({ where: { id } });
  }
}
