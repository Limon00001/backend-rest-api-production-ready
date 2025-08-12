/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 12 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';

// Internal Imports
import commentBlog from '@/controllers/v1/comment/comment_blog';
import deleteComment from '@/controllers/v1/comment/delete_comment';
import getCommentsByBlog from '@/controllers/v1/comment/get_comments_by_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationErrors from '@/middlewares/validationErrors';
import { body, param } from 'express-validator';

// Router Instance
const router = Router();

// Routes
router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationErrors,
  commentBlog,
);

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  validationErrors,
  getCommentsByBlog,
);

router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin', 'user']),
  param('commentId').isMongoId().withMessage('Invalid comment ID'),
  validationErrors,
  deleteComment,
);

// Export
export default router;
