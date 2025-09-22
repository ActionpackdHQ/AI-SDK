import { z } from 'zod';
import { Provider, CompletionOptions, ValidationError } from './types';
import { validateOutput, generateSchemaHint } from './schema';
import { interpolate, validateTemplate } from './utils/interp';
import { logger } from './utils/logger';

/**
 * Options for serverCompose
 */
export interface ComposeOptions extends Omit<CompletionOptions, 'retries'> {
  retries?: number;
  variables?: Record<string, unknown>;
}

/**
 * Server-side composition with validation and retries
 */
export async function serverCompose<T>(
  provider: Provider,
  prompt: string,
  options: ComposeOptions & { schema: z.ZodType<T> }
): Promise<T>;
export async function serverCompose(
  provider: Provider,
  prompt: string,
  options?: ComposeOptions
): Promise<string>;
export async function serverCompose<T>(
  provider: Provider,
  prompt: string,
  options: ComposeOptions = { temperature: 0.7 }
): Promise<T | string> {
  // Validate template safety
  if (!validateTemplate(prompt)) {
    throw new Error('Invalid template: contains unsafe patterns');
  }

  // Interpolate variables if provided
  const interpolatedPrompt = options.variables
    ? interpolate(prompt, options.variables)
    : prompt;

  // Ensure retries has a default value
  const finalOptions = {
    ...options,
    retries: options.retries ?? 0,
    temperature: options.temperature ?? 0.7
  };

  logger.debug(`Generating completion with ${provider.id}`);

  try {
    const completion = await provider.generateCompletion(interpolatedPrompt, finalOptions);

    if (finalOptions.schema) {
      return validateOutput(completion, finalOptions.schema);
    }

    return completion;
  } catch (e) {
    if (e instanceof ValidationError && finalOptions.retries > 0) {
      logger.debug(`Validation failed, retrying with schema hint (${options.retries} retries left)`);
      
      // Add schema hint and retry
      const schemaHint = generateSchemaHint(finalOptions.schema as z.ZodType<unknown>);
      const promptWithHint = `${interpolatedPrompt}\n\n${schemaHint}`;
      
      return serverCompose(provider, promptWithHint, {
        ...options,
        retries: finalOptions.retries - 1,
      });
    }
    
    throw e;
  }
}

/**
 * Validate and retry a completion with schema hints
 */
export async function validateAndRetry<T>(
  provider: Provider,
  completion: string,
  schema: z.ZodType<T>,
  prompt: string,
  maxRetries = 1
): Promise<T> {
  try {
    return validateOutput(completion, schema);
  } catch (e) {
    if (maxRetries > 0) {
      logger.debug('Validation failed, retrying with schema hint');
      
      const schemaHint = generateSchemaHint(schema);
      const promptWithHint = `${prompt}\n\n${schemaHint}`;
      
      const newCompletion = await provider.generateCompletion(promptWithHint);
      return validateAndRetry(provider, newCompletion, schema, promptWithHint, maxRetries - 1);
    }
    
    throw e;
  }
}
