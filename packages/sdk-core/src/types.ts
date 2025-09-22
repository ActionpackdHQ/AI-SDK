import { z } from 'zod';

/**
 * Provider configuration options
 */
export const ProviderConfigSchema = z.object({
  id: z.string(),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  temperature: z.number().min(0).max(1).optional().default(0.7),
  maxTokens: z.number().positive().optional(),
});

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;

/**
 * Provider interface that all AI providers must implement
 */
export interface Provider {
  id: string;
  generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
  generateStream(prompt: string, options?: CompletionOptions): AsyncIterable<string>;
}

/**
 * Options for completion requests
 */
export const CompletionOptionsSchema = z.object({
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().positive().optional(),
  schema: z.any().optional(), // zod schema for validation
  retries: z.number().min(0).max(3).optional(),
}).transform((data) => ({
  ...data,
  retries: data.retries ?? 0,
  temperature: data.temperature ?? 0.7
}));

export type CompletionOptions = z.infer<typeof CompletionOptionsSchema>;

/**
 * Flow step configuration
 */
export const FlowStepSchema = z.object({
  prompt: z.string(),
  variables: z.record(z.string()).optional(),
  schema: z.any().optional(),
  retries: z.number().min(0).max(3).optional(),
});

export type FlowStep = z.infer<typeof FlowStepSchema>;

/**
 * Telemetry configuration
 */
export const TelemetryConfigSchema = z.object({
  enabled: z.boolean().default(false),
  endpoint: z.string().url().optional(),
});

export type TelemetryConfig = z.infer<typeof TelemetryConfigSchema>;

/**
 * Error types
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public raw: string,
    public issues: Array<{ message: string }>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ProviderError extends Error {
  constructor(message: string, public providerName: string) {
    super(message);
    this.name = 'ProviderError';
  }
}

export class FlowError extends Error {
  constructor(message: string, public step: number) {
    super(message);
    this.name = 'FlowError';
  }
}
