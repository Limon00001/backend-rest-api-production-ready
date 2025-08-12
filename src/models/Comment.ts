/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 12 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Schema, Types, model } from 'mongoose';

interface IComment {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [1000, 'Content must be less than 1000 characters'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

const Comment = model<IComment>('Comment', commentSchema);

export { Comment, IComment };
