import { describe, it, expect, vi } from 'vitest';
import { MockOpenAIProvider } from './mocks/providers';
import { serverCompose } from '../src/compose';
import { ProductSchema } from './fixtures/schemas';
import { ValidationError, Provider } from '../src/types';

describe('serverCompose', () => {
  const provider = new MockOpenAIProvider({ id: 'openai', temperature: 0.7 });

  it('should generate a basic completion', async () => {
    const completion = await serverCompose(provider, 'Test prompt');
    expect(completion).toBeTruthy();
  });

  it('should handle variable interpolation', async () => {
    const completion = await serverCompose(
      provider,
      'Hello {{name}}!',
      { variables: { name: 'World' }, retries: 0 }
    );
    expect(completion).toContain('Hello');
  });

  it('should validate output against schema', async () => {
    const result = await serverCompose(
      provider,
      'Generate product info',
      { schema: ProductSchema, retries: 0 }
    );
    
    expect(result).toMatchObject({
      name: expect.any(String),
      price: expect.any(Number),
      description: expect.any(String),
      inStock: expect.any(Boolean),
    });
  });

  it('should retry on validation failure', async () => {
    const mockProvider: Provider = {
      id: 'mock',
      generateCompletion: vi.fn()
        .mockResolvedValueOnce('invalid json')
        .mockResolvedValueOnce('{"name": "Test", "price": 42, "description": "A test", "inStock": true}'),
      generateStream: vi.fn(),
    };

    const result = await serverCompose(
      mockProvider,
      'Generate product',
      {
        schema: ProductSchema,
        retries: 1
      }
    );

    expect(mockProvider.generateCompletion).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      name: 'Test',
      price: 42,
    });
  });

  it('should throw ValidationError after max retries', async () => {
    const mockProvider: Provider = {
      id: 'mock',
      generateCompletion: vi.fn().mockResolvedValue('invalid json'),
      generateStream: vi.fn(),
    };

    await expect(
      serverCompose(
        mockProvider,
        'Generate product',
        {
          schema: ProductSchema,
          retries: 1,
        }
      )
    ).rejects.toThrow(ValidationError);
  });
});
