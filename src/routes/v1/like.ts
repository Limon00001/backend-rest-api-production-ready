/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 11 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';
import { body, param } from 'express-validator';

// Internal Imports
import disLikeBlog from '@/controllers/v1/likes/dislike_blog';
import likeBlog from '@/controllers/v1/likes/like_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationErrors from '@/middlewares/validationErrors';

// Router Instance
const router = Router();

// Routes
router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  validationErrors,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  validationErrors,
  disLikeBlog,
);

// Export
export default router;
