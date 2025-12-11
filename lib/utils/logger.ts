/**
 * Centralized logging utility for the application.
 * 
 * Provides consistent logging across the codebase with:
 * - Environment-aware logging (only logs in development)
 * - Error tracking integration
 * - Structured logging format
 * 
 * Usage:
 *   import { logger } from '@/lib/utils/logger';
 *   
 *   logger.debug('Debug message', { data });
 *   logger.info('Info message');
 *   logger.warn('Warning message', { context });
 *   logger.error('Error message', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '');
    }
    // In production, could send to analytics/monitoring service
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');
    // In production, could send to error tracking service
  }

  /**
   * Log error messages
   * 
   * @param message - Error message
   * @param error - Error object or context
   */
  error(message: string, error?: Error | LogContext | unknown): void {
    console.error(`[ERROR] ${message}`, error || '');
    
    // In production, send to error tracking service
    if (this.isProduction && error instanceof Error) {
      // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
      // Example:
      // if (window.Sentry) {
      //   window.Sentry.captureException(error, { extra: { message } });
      // }
    }
  }

  /**
   * Log API errors with request context
   */
  apiError(message: string, error: unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };

    this.error(message, errorContext);
  }

  /**
   * Log performance metrics (only in development)
   */
  performance(label: string, duration: number, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[PERF] ${label}: ${duration}ms`, context || '');
    }
    // In production, could send to analytics
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other modules
export type { LogLevel, LogContext };
