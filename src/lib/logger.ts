/**
 * Structured logging utility
 * Replace console.log/error with this for better error tracking
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logs a message with structured data
 */
function log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : undefined,
  };
  
  // In production, send to logging service (Sentry, LogRocket, etc.)
  // For now, use console with structured format
  const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  
  if (process.env.NODE_ENV === 'production') {
    // In production, use JSON format for log aggregation
    logMethod(JSON.stringify(entry));
  } else {
    // In development, use readable format
    logMethod(`[${level.toUpperCase()}] ${message}`, context || '', error || '');
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    log('info', message, context);
  },
  
  warn: (message: string, context?: Record<string, unknown>) => {
    log('warn', message, context);
  },
  
  error: (message: string, error?: Error, context?: Record<string, unknown>) => {
    log('error', message, context, error);
  },
  
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, context);
    }
  },
};

