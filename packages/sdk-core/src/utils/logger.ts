import { redactPII } from './redact';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  level: LogLevel;
  redactSensitive: boolean;
  enabled: boolean;
}

class Logger {
  private config: LoggerConfig = {
    level: 'info',
    redactSensitive: true,
    enabled: false, // Default to no-op
  };

  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  /**
   * Set the log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Enable or disable PII redaction
   */
  setRedaction(enabled: boolean): void {
    this.config.redactSensitive = enabled;
  }

  /**
   * Process message before logging
   */
  private processLog(message: string | object): string | object {
    if (typeof message === 'string') {
      return this.config.redactSensitive ? redactPII(message) : message;
    }

    const processed = { ...message };
    
    // Handle ValidationError and similar objects with raw field
    if ('raw' in processed && processed.raw) {
      const rawStr = String(processed.raw);
      processed.raw = this.config.redactSensitive 
        ? redactPII(rawStr).slice(0, 1024) + (rawStr.length > 1024 ? '…[truncated]' : '')
        : rawStr.slice(0, 1024) + (rawStr.length > 1024 ? '…[truncated]' : '');
    }

    return processed;
  }

  /**
   * Check if level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && this.levels[level] >= this.levels[this.config.level];
  }

  /**
   * Log methods
   */
  debug(message: string | object, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.processLog(message), ...args);
    }
  }

  info(message: string | object, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.processLog(message), ...args);
    }
  }

  warn(message: string | object, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.processLog(message), ...args);
    }
  }

  error(message: string | object, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.processLog(message), ...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
