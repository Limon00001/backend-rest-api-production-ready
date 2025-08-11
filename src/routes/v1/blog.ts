/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import multer from 'multer';

// Internal Imports
import createBlog from '@/controllers/v1/blog/create_blog';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs';
import getBlogBySlug from '@/controllers/v1/blog/get_blog_by_slug';
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
import validationErrors from '@/middlewares/validationErrors';

// Multer Middleware
const upload = multer();

// Router Instance
const router = Router();

// Routes
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Invalid status value'),
  validationErrors,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['user', 'admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  validationErrors,
  getAllBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['user', 'admin']),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  validationErrors,
  getBlogsByUser,
);

router.get(
  '/:slug',
  authenticate,
  authorize(['user', 'admin']),
  param('slug').notEmpty().withMessage('Slug is required'),
  validationErrors,
  getBlogBySlug,
);

// Export
export default router;
