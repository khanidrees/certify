type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV !== 'production';

function log(level: LogLevel, message: string, meta: Record<string, unknown> = {}) {
  const entry: LogEntry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  };

  if (isDev) {
    // Pretty print in development
    const prefix = { info: '📘', warn: '⚠️ ', error: '❌', debug: '🔍' }[level];
    const rest = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    logFn(`${prefix} [${entry.timestamp}] ${message}`, rest || '');
  } else {
    // Structured JSON for log aggregators (Vercel, Datadog, etc.)
    const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    logFn(JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),

  /**
   * Returns start time. Call logger.end(start, ...) when the request completes.
   */
  startRequest: (route: string, method: string) => {
    const start = Date.now();
    log('info', `→ ${method} ${route}`, { route, method });
    return start;
  },

  endRequest: (
    start: number,
    route: string,
    method: string,
    status: number
  ) => {
    const durationMs = Date.now() - start;
    const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    log(level, `← ${method} ${route} ${status} (${durationMs}ms)`, {
      route,
      method,
      status,
      durationMs,
    });
  },
};
