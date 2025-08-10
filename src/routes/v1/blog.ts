/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';
import multer from 'multer';

// Internal Imports
import createBlog from '@/controllers/v1/blog/create_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';

// Multer Middleware
const upload = multer();

// Router Instance
const router = Router();

// Routes
router.get(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  createBlog,
);

// Export
export default router;
