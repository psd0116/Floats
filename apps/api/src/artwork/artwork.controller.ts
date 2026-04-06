import type { Request, Response } from 'express';
import { ArtworkService } from './artwork.service.js';
import { prisma } from '../db/prisma.js';
import { S3Service } from '../aws/s3.service.js';

export class ArtworkController {
  static async getRecentArtworks(req: any, res: Response) {
    try {
      const { type } = req.query; // 'family' or 'public'
      const filters: any = {};

      if (type === 'public') {
        filters.isPublic = true;
      } else {
        // Default to family, requires login
        if (!req.userId) return res.status(401).json({ error: 'Authentication required' });
        const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { familyCode: true } });
        filters.familyCode = user?.familyCode;
      }

      const artworks = await ArtworkService.getAllArtworks(filters);
      res.status(200).json(artworks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMyArtworks(req: any, res: Response) {
    try {
      const artworks = await ArtworkService.getArtworksByUserId(req.userId);
      res.status(200).json(artworks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createArtwork(req: any, res: Response) {
    try {
      const { title, tags, isPublic } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      // Upload to S3
      const s3Url = await S3Service.uploadImage(file.buffer, file.originalname, file.mimetype);

      // Parse fields if they came from FormData as strings
      const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      const parsedIsPublic = typeof isPublic === 'string' ? isPublic === 'true' : isPublic;

      const artwork = await ArtworkService.createArtwork(req.userId, { 
        title, 
        thumbnail: s3Url, 
        tags: parsedTags || ['신규'], 
        isPublic: parsedIsPublic 
      });
      res.status(201).json(artwork);
    } catch (error: any) {
      console.error('Artwork creation error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getArtworkDetail(req: any, res: Response) {
    try {
      const id = req.params.id as string;
      const artwork = await ArtworkService.getArtworkById(id);
      if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

      // If artwork is private, verify user belongs to the same family
      if (!artwork.isPublic) {
        if (!req.userId) return res.status(401).json({ error: 'Authentication required for private artworks' });
        const viewer = await prisma.user.findUnique({ where: { id: req.userId }, select: { familyCode: true } });
        if (!viewer || viewer.familyCode !== artwork.user?.familyCode) {
          return res.status(403).json({ error: 'Not authorized to view this artwork' });
        }
      }

      res.status(200).json(artwork);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteArtwork(req: any, res: Response) {
    try {
      const id = req.params.id as string;
      await ArtworkService.deleteArtwork(id, req.userId);
      res.status(200).json({ message: 'Artwork deleted' });
    } catch (error: any) {
      const status = error.message === 'Not authorized' ? 403 : error.message === 'Artwork not found' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }
}
