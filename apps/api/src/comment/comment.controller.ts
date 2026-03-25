import type { Response } from 'express';
import { CommentService } from './comment.service.js';

export class CommentController {
  static async createComment(req: any, res: Response) {
    try {
      const { artworkId, content } = req.body;
      if (!artworkId || !content) {
        return res.status(400).json({ error: 'ArtworkId and content are required' });
      }

      const comment = await CommentService.createComment(req.userId, artworkId, content);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getComments(req: any, res: Response) {
    try {
      const { artworkId } = req.query;
      if (!artworkId) {
        return res.status(400).json({ error: 'ArtworkId is required' });
      }

      const comments = await CommentService.getCommentsByArtworkId(artworkId as string);
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
