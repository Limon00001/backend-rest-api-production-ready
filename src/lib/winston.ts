/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 30 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import winston from 'winston';

// Internal Imports
import config from '@/config';

// Destructure winston's format module
const { combine, timestamp, printf, errors, json, colorize, align } =
  winston.format;

// Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// If application is not running in production mode, add a console transport
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // Enable colorization in the console output
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), // Add timestamp to the log messages
        align(), // Align the log messages to the left
        printf(({ level, message, timestamp, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';

          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

// Create a logger instance with winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info', // Set the default log level to 'info'
  format: combine(timestamp(), errors({ stack: true }), json()), // Use JSON format for log messages
  transports,
  silent: config.NODE_ENV === 'test', // Disable logging in test mode
});

// Export the logger
export { logger };
