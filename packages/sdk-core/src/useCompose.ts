import { useState, useCallback, useRef, useEffect } from 'react';
import { z } from 'zod';
import { CompletionOptions } from './types';
import { StreamProcessor } from './stream';

interface UseComposeOptions extends Omit<CompletionOptions, 'retries' | 'temperature'> {
  retries?: number;
  temperature?: number;
  schema?: z.ZodType<unknown>;
  endpoint?: string;
  onStructured?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

interface UseComposeResult {
  completion: string;
  isLoading: boolean;
  error: Error | null;
  cancel: () => void;
}

/**
 * React hook for streaming completions from a server endpoint
 */
export function useCompose(
  prompt: string,
  options: UseComposeOptions = { retries: 0, temperature: 0.7 }
): UseComposeResult {
  const [completion, setCompletion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController>();
  const streamProcessorRef = useRef<StreamProcessor>();
  
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!prompt) return;

    const fetchStream = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setCompletion('');

        abortControllerRef.current = new AbortController();
        
        const endpoint = options.endpoint || '/api/compose';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            ...options,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body!');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        streamProcessorRef.current = new StreamProcessor({
          schema: options.schema as z.ZodType<unknown>,
        });

        streamProcessorRef.current.on('token', (token: string) => {
          setCompletion((prev: string) => prev + token);
        });

        streamProcessorRef.current.on('structured', (data: unknown) => {
          options.onStructured?.(data);
        });

        streamProcessorRef.current.on('error', (err: Error) => {
          options.onError?.(err);
        });

        let isDone = false;
      while (!isDone) {
          const { done, value } = await reader.read();
          
          if (done) {
            streamProcessorRef.current.end();
            isDone = true;
            continue;
          }

          const chunk = decoder.decode(value);
          streamProcessorRef.current.processToken(chunk);
        }
      } catch (e) {
        const error = e as Error;
        if (error.name === 'AbortError') {
          return;
        }
        setError(error);
        options.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStream();

    return () => {
      cancel();
    };
  }, [prompt, options.endpoint, cancel]);

  return {
    completion,
    isLoading,
    error,
    cancel,
  };
}
