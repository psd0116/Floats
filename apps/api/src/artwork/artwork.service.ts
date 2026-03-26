import { prisma } from '../db/prisma.js';

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
          select: { name: true }
        }
      }
    });
  }
}
