import { Router } from 'express';
import { HealthController } from '../health/health.controller.js';
import { AuthController } from '../auth/auth.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { ArtworkController } from '../artwork/artwork.controller.js';
import { CommentController } from '../comment/comment.controller.js';

export const router = Router();

router.get('/health', HealthController.getHealth);

// Auth Routes
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', authMiddleware, AuthController.getMe);

// Artwork Routes
router.get('/artworks', authMiddleware, ArtworkController.getRecentArtworks);
router.get('/artworks/my', authMiddleware, ArtworkController.getMyArtworks);
router.post('/artworks', authMiddleware, ArtworkController.createArtwork);
router.get('/artworks/:id', ArtworkController.getArtworkDetail);

// Comment Routes
router.post('/comments', authMiddleware, CommentController.createComment);
router.get('/comments', CommentController.getComments);