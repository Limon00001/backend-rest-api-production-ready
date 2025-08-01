/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';

// Internal Imports
import resgister from '@/controllers/v1/auth/register';

// Router Instance
const router = Router();

router.post('/register', resgister);

// Export
export default router;
