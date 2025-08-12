/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 11 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { model, Schema, Types } from 'mongoose';

// Types
interface ILike {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  commentId?: Types.ObjectId;
}

// Like Schema
const likeSchema = new Schema<ILike>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

// Like Model
const Like = model<ILike>('Like', likeSchema);

// Export
export { ILike, Like };
