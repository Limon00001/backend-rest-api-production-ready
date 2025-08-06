/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 06 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';

// Internal Imports
import getCurrentUser from '@/controllers/v1/user/get_current_user';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';

// Router Instance
const router = Router();

// Routes
router.get(
  '/current',
  authenticate,
  authorize(['user', 'admin']),
  getCurrentUser,
);

// Export
export default router;
