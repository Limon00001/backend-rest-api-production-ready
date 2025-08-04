/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 30 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { rateLimit } from 'express-rate-limit';

// Confiure rate limit middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 60, // Limit each IP to 60 requests per window (here, per 1 minutes).
  standardHeaders: 'draft-8', // Use the latest rate-limit headers
  legacyHeaders: false, // Disable the deprecated X-RateLimit headers.
  message: {
    error:
      'You have sent too many requests in a short period of time. Please try again later.',
  },
});

// Export
export default limiter;
