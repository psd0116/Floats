import type { Request, Response } from 'express';
import { ArtworkService } from './artwork.service.js';
import { prisma } from '../db/prisma.js';

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
      const { title, thumbnail, tags, isPublic } = req.body;
      const artwork = await ArtworkService.createArtwork(req.userId, { title, thumbnail, tags, isPublic });
      res.status(201).json(artwork);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getArtworkDetail(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const artwork = await ArtworkService.getArtworkById(id);
      if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
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
