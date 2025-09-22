import { z } from 'zod';
import { Provider, ProviderConfig, CompletionOptions } from '../../src/types';
import { logger } from '../../src/utils/logger';

/**
 * Mock OpenAI provider that returns JSON-focused responses
 */
export class MockOpenAIProvider implements Provider {
  public readonly id: string;

  constructor(config: ProviderConfig) {
    this.id = config.id;
  }

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    logger.debug(`MockOpenAI generating completion for prompt: ${prompt}`);
    
    if (options?.schema) {
      const mockData = this.generateMockData(options.schema);
      return `\`\`\`json\n${JSON.stringify(mockData, null, 2)}\n\`\`\``;
    }
    
    // Handle interpolation in prompt
    return prompt;
  }

  async *generateStream(prompt: string, options?: CompletionOptions): AsyncIterable<string> {
    logger.debug(`MockOpenAI streaming for prompt: ${prompt}`);
    
    if (options?.schema) {
      const mockData = this.generateMockData(options.schema);
      const json = JSON.stringify(mockData, null, 2);
      
      yield '```json\n';
      for (const char of json) {
        yield char;
      }
      yield '\n```';
      return;
    }
    
    const response = 'This is a mock OpenAI streaming response.';
    for (const char of response) {
      yield char;
    }
  }

  private generateMockData(schema: z.ZodType<unknown>): unknown {
    // Handle intent enum
    if (schema instanceof z.ZodEnum) {
      return schema.options[0];
    }
    if (schema instanceof z.ZodObject) {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(schema.shape)) {
        if (value instanceof z.ZodType) {
          result[key] = this.generateMockData(value);
        }
      }
      return result;
    }
    
    if (schema instanceof z.ZodString) return 'mock string';
    if (schema instanceof z.ZodNumber) {
      // Special case for confidence which must be between 0 and 1
      if (schema._def.checks?.some(check => check.kind === 'max' && check.value === 1)) {
        return 0.95;
      }
      return 42;
    }
    if (schema instanceof z.ZodBoolean) return true;
    if (schema instanceof z.ZodArray) {
      const elementType = schema.element;
      return [this.generateMockData(elementType)];
    }
    
    return null;
  }
}

/**
 * Mock Anthropic provider that returns verbose, human-like responses
 */
export class MockAnthropicProvider implements Provider {
  public readonly id: string;

  constructor(config: ProviderConfig) {
    this.id = config.id;
  }

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    logger.debug(`MockAnthropic generating completion for prompt: ${prompt}`);
    
    if (options?.schema) {
      const mockData = this.generateMockData(options.schema);
      return `Let me provide that information for you in a structured format:

\`\`\`json
${JSON.stringify(mockData, null, 2)}
\`\`\`

I've ensured the data follows the requested schema exactly.`;
    }
    
    return 'Here is a thoughtful response in Claude\'s characteristic detailed and helpful style.';
  }

  async *generateStream(prompt: string, options?: CompletionOptions): AsyncIterable<string> {
    logger.debug(`MockAnthropic streaming for prompt: ${prompt}`);
    
    if (options?.schema) {
      yield 'Let me provide that information in a structured format:\n\n';
      yield '```json\n';
      
      const mockData = this.generateMockData(options.schema);
      const json = JSON.stringify(mockData, null, 2);
      
      for (const char of json) {
        yield char;
      }
      
      yield '\n```\n\n';
      yield 'I hope this structured data meets your needs!';
      return;
    }
    
    const response = 'Here is a thoughtful streaming response from Claude...';
    for (const char of response) {
      yield char;
    }
  }

  private generateMockData(schema: z.ZodType<unknown>): unknown {
    // Handle intent enum
    if (schema instanceof z.ZodEnum) {
      return schema.options[0];
    }
    if (schema instanceof z.ZodObject) {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(schema.shape)) {
        if (value instanceof z.ZodType) {
          result[key] = this.generateMockData(value);
        }
      }
      return result;
    }
    
    if (schema instanceof z.ZodString) return 'A detailed and comprehensive mock string response';
    if (schema instanceof z.ZodNumber) {
      // Special case for confidence which must be between 0 and 1
      if (schema._def.checks?.some(check => check.kind === 'max' && check.value === 1)) {
        return 0.95;
      }
      return 42;
    }
    if (schema instanceof z.ZodBoolean) return true;
    if (schema instanceof z.ZodArray) {
      const elementType = schema.element;
      return [this.generateMockData(elementType)];
    }
    
    return null;
  }
}

/**
 * Mock Gemini provider that returns balanced, modern responses
 */
export class MockGeminiProvider implements Provider {
  public readonly id: string;

  constructor(config: ProviderConfig) {
    this.id = config.id;
  }

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    logger.debug(`MockGemini generating completion for prompt: ${prompt}`);
    
    if (options?.schema) {
      const mockData = this.generateMockData(options.schema);
      return `Here's the structured output:
\`\`\`json
${JSON.stringify(mockData, null, 2)}
\`\`\`
`;
    }
    
    return 'A balanced response from Gemini, combining precision with natural language.';
  }

  async *generateStream(prompt: string, options?: CompletionOptions): AsyncIterable<string> {
    logger.debug(`MockGemini streaming for prompt: ${prompt}`);
    
    if (options?.schema) {
      yield 'Here\'s the structured output:\n';
      yield '```json\n';
      
      const mockData = this.generateMockData(options.schema);
      const json = JSON.stringify(mockData, null, 2);
      
      for (const char of json) {
        yield char;
      }
      
      yield '\n```';
      return;
    }
    
    const response = 'A balanced streaming response from Gemini...';
    for (const char of response) {
      yield char;
    }
  }

  private generateMockData(schema: z.ZodType<unknown>): unknown {
    // Handle intent enum
    if (schema instanceof z.ZodEnum) {
      return schema.options[0];
    }
    if (schema instanceof z.ZodObject) {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(schema.shape)) {
        if (value instanceof z.ZodType) {
          result[key] = this.generateMockData(value);
        }
      }
      return result;
    }
    
    if (schema instanceof z.ZodString) return 'Balanced mock response from Gemini';
    if (schema instanceof z.ZodNumber) {
      // Special case for confidence which must be between 0 and 1
      if (schema._def.checks?.some(check => check.kind === 'max' && check.value === 1)) {
        return 0.95;
      }
      return 42;
    }
    if (schema instanceof z.ZodBoolean) return true;
    if (schema instanceof z.ZodArray) {
      const elementType = schema.element;
      return [this.generateMockData(elementType)];
    }
    
    return null;
  }
}
