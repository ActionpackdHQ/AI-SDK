import { EventEmitter } from 'events';
import { z } from 'zod';
import { logger } from './utils/logger';

/**
 * Events emitted by StreamProcessor
 */
export interface StreamEvents {
  token: (token: string) => void;
  structured: (data: unknown) => void;
  error: (error: Error) => void;
  end: () => void;
}

/**
 * Options for stream processing
 */
export interface StreamOptions {
  schema?: z.ZodType<unknown>;
  bufferSize?: number;
  jsonDetection?: boolean;
}

/**
 * Processes streaming tokens and detects JSON structures
 */
export class StreamProcessor extends EventEmitter {
  private buffer = '';
  private readonly options: StreamOptions & { bufferSize: number; jsonDetection: boolean; };

  constructor(options: StreamOptions = {}) {
    super();
    this.options = {
      bufferSize: 4096,
      jsonDetection: true,
      ...options,
      schema: options.schema,
    };
  }

  /**
   * Process a single token
   */
  processToken(token: string): void {
    // Emit the raw token
    this.emit('token', token);

    if (this.options.jsonDetection || this.options.schema) {
      // Add to buffer and check for JSON
      this.buffer += token;
      
      if (this.buffer.length > this.options.bufferSize) {
        // Prevent buffer from growing too large
        this.buffer = this.buffer.slice(-this.options.bufferSize);
      }

      this.detectAndEmitJSON();
    }
  }

  /**
   * Process the end of the stream
   */
  end(): void {
    // Final check for JSON in buffer
    this.detectAndEmitJSON();
    this.emit('end');
    this.buffer = '';
  }

  private detectAndEmitJSON(): void {
    try {
      // Look for JSON blocks
      const matches = this.buffer.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
      
      if (matches) {
        const jsonStr = matches[1];
        
        try {
          const data = JSON.parse(jsonStr);
          
          // Validate against schema if provided
          if (this.options.schema) {
            const validated = this.options.schema.parse(data);
            this.emit('structured', validated);
          } else {
            this.emit('structured', data);
          }
          
          // Remove processed JSON from buffer
          this.buffer = this.buffer.replace(matches[0], '');
        } catch (e) {
          logger.debug('Invalid JSON found in stream', e);
        }
      }
    } catch (e) {
      const error = e as Error;
      logger.error('Error processing stream', error);
      this.emit('error', error);
    }
  }
}

/**
 * Creates an async iterator that processes a stream with the given options
 */
export async function* processStream(
  stream: AsyncIterable<string>,
  options?: StreamOptions
): AsyncIterable<string> {
  const processor = new StreamProcessor(options);
  
  try {
    for await (const chunk of stream) {
      processor.processToken(chunk);
      yield chunk;
    }
  } finally {
    processor.end();
  }
}

/**
 * Helper to convert a stream to a string with JSON detection
 */
export async function streamToString(
  stream: AsyncIterable<string>,
  options?: StreamOptions
): Promise<string> {
  let result = '';
  for await (const chunk of processStream(stream, options)) {
    result += chunk;
  }
  return result;
}
