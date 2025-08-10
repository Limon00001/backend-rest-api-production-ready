/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';

// Internal Imports
import createBlog from '@/controllers/v1/blog/create_blog';
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
  body('banner_image').notEmpty().withMessage('Banner image is required'),
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

// Export
export default router;
