/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 04 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Types
import { Types } from 'mongoose';

// Extend Express Request interface to include userId
// This allows us to attach the userId from the JWT payload to the request object
declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
