import type { Request, Response } from 'express';
import { ArtworkService } from './artwork.service.js';

export class ArtworkController {
  static async getRecentArtworks(req: Request, res: Response) {
    try {
      const artworks = await ArtworkService.getAllArtworks();
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
      const { title, thumbnail, tags } = req.body;
      const artwork = await ArtworkService.createArtwork(req.userId, { title, thumbnail, tags });
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
}
