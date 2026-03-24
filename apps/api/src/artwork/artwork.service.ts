import { prisma } from '../db/prisma.js';

export class ArtworkService {
  static async getAllArtworks() {
    return await prisma.artwork.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
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

  static async createArtwork(userId: string, data: { title: string; thumbnail: string; tags?: string[] }) {
    return await prisma.artwork.create({
      data: {
        title: data.title,
        thumbnail: data.thumbnail,
        tags: data.tags || [],
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
