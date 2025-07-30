/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 30 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';

// Router Instance
const router = Router();

// Root Routes
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is running',
    version: '1.0.0',
    status: 'ok',
    docs: 'https://github.com/Limon00001/backend-rest-api-production-ready/blob/main/README.md',
    timestamp: new Date().toISOString(),
  });
});

// Export
export default router;
