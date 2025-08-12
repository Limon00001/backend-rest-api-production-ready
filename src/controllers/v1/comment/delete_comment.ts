/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 12 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { Comment } from '@/models/Comment';
import { User } from '@/models/User';

// Types
import type { Request, Response } from 'express';

// Controller Function to delete a comment
const deleteComment = async (req: Request, res: Response): Promise<void> => {
  // Destructure the request body
  const { commentId } = req.params;
  const currentUserId = req.userId;

  try {
    /**
     * Find the comment by ID
     * Use select('userId blogId') to select specific fields
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * This improves performance and reduces memory usage
     */
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();

    /**
     * Find the user by ID
     * Use select('role') to select specific fields
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * This improves performance and reduces memory usage
     */
    const user = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    // Check if the comment exists
    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    /**
     * Find the blog by ID and select the commentsCount field
     */
    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    // Check if the blog exists
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    /**
     * Check if the user is the current user and authorized admin to delete the comment
     */
    if (comment.userId !== currentUserId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message:
          'Access denied. You are not authorized to delete this comment.',
      });

      // Log the error for debugging purposes
      logger.error('A user tried to delete a comment without permission', {
        userId: currentUserId,
        comment,
      });
      return;
    }

    // Delete the comment from the database
    await Comment.deleteOne({ _id: commentId });

    // Log the deleted comment for debugging purposes
    logger.info('Comment deleted successfully', {
      commentId,
    });

    // Decrement the commentsCount of the blog
    blog.commentsCount--;

    // Save the blog
    await blog.save();

    // Log the updated comments count for debugging purposes
    logger.info('Blog comments count updated successfully', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    // Send a 204 `No Content` response
    res.sendStatus(204);
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error while deleting a comment', error);

    // Send a user-friendly error message
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default deleteComment;
