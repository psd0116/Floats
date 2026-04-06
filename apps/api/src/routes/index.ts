import { Router } from 'express';
import { HealthController } from '../health/health.controller.js';
import { AuthController } from '../auth/auth.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { ArtworkController } from '../artwork/artwork.controller.js';
import { CommentController } from '../comment/comment.controller.js';
import { UserController } from '../user/user.controller.js';
import { optionalAuthMiddleware } from '../auth/auth.optional.middleware.js';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only accept these mimetypes
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP and GIF are allowed.'));
    }
  }
});

export const router = Router();

router.get('/health', HealthController.getHealth);

// Auth Routes
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', authMiddleware, AuthController.getMe);

// Artwork Routes
router.get('/artworks', authMiddleware, ArtworkController.getRecentArtworks);
router.get('/artworks/my', authMiddleware, ArtworkController.getMyArtworks);
router.post('/artworks', authMiddleware, upload.single('image'), ArtworkController.createArtwork);
router.get('/artworks/:id', optionalAuthMiddleware, ArtworkController.getArtworkDetail);
router.delete('/artworks/:id', authMiddleware, ArtworkController.deleteArtwork);

// Comment Routes
router.post('/comments', authMiddleware, CommentController.createComment);
router.get('/comments', authMiddleware, CommentController.getComments);

// User / MyPage Routes
router.get('/user/stats', authMiddleware, UserController.getMyStats);
router.get('/user/calendar', authMiddleware, UserController.getActivityCalendar);
router.get('/user/badges', authMiddleware, UserController.getBadges);
router.get('/user/family', authMiddleware, UserController.getFamilyMembers);
router.put('/user/profile', authMiddleware, UserController.updateProfile);