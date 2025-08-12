/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 30 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import mongoose from 'mongoose';

// Internal Imports
import config from '@/config';
import { logger } from '@/lib/winston';

// Types
import type { ConnectOptions } from 'mongoose';

// Mongoose Client Options - Contains additional configuration options for the database
const clientOptions: ConnectOptions = {
  dbName: 'blog-api',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

/**
 * Establish a connection to the database
 * If the connection fails, an error is thrown with a message
 *
 * - Uses 'MONGO_URI' environment variable to connect to the database
 * - 'clientOptions' contains additional configuration options for the database connection
 * - Errors are properly handled and rethrown for better debugging
 */
const connectToDatabase = async (): Promise<void> => {
  // Check if the 'MONGO_URI' environment variable is not defined
  if (!config.MONGO_URI) {
    throw new Error('MONGODB URI is not defined in the environment variables.');
  }

  try {
    // Event listener for successful database connection
    mongoose.connection.on('connected', () =>
      logger.info('Database connected successfully!', {
        uri: config.MONGO_URI,
        options: clientOptions,
      }),
    );

    // Connect to the database
    await mongoose.connect(config.MONGO_URI, clientOptions);

    // Event listener for database disconnection
    mongoose.connection.on('error', (err) =>
      logger.error(`Database connection error: ${err}`),
    );
  } catch (error) {
    // Rethrow the error if it is an instance of `Error`
    if (error instanceof Error) {
      throw error;
    }

    logger.error(`Error connecting to database: ${error}`);
  }
};

/**
 * Disconnect from the database
 *
 * This function disconnects from the database asynchronously.
 * If the disconnection is successful, a message is logged to the console.
 * If an error occurs during the disconnection, it is either rethrown (if it is an instance of `Error`) or logged to the console.
 */
const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info('Database disconnected successfully!', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    // Rethrow the error if it is an instance of `Error`
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error(`Error disconnecting from database: ${error}`);
  }
};

// Export
export { connectToDatabase, disconnectFromDatabase };
