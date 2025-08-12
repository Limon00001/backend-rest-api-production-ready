/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { v2 as cloudinary } from 'cloudinary';

// Internal Imports
import config from '@/config';
import { logger } from '@/lib/winston';

// Types
import type { UploadApiResponse } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Upload File to Cloudinary
const uploadToCloudinary = (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['jpg', 'png', 'webp'],
          resource_type: 'image',
          public_id: publicId,
          folder: 'blog-api',
          transformation: {
            quality: 'auto',
          },
        },
        (error, result) => {
          if (error) {
            logger.error('Error uploading file to Cloudinary:', error);
            reject(error);
          }
          resolve(result);
        },
      )
      .end(buffer);
  });
};

// Export
export default uploadToCloudinary;
