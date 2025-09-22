import { describe, it, expect } from 'vitest';
import { StreamProcessor, processStream, streamToString } from '../src/stream';
import { ProductSchema } from './fixtures/schemas';

describe('StreamProcessor', () => {
  it('should emit tokens', () => {
    const processor = new StreamProcessor();
    const tokens: string[] = [];

    processor.on('token', (token: string) => {
      tokens.push(token);
    });

    processor.processToken('Hello ');
    processor.processToken('World');
    processor.end();

    expect(tokens).toEqual(['Hello ', 'World']);
  });

  it('should detect and emit JSON', () => {
    const processor = new StreamProcessor({ schema: ProductSchema });
    const structured: unknown[] = [];

    processor.on('structured', (data: unknown) => {
      structured.push(data);
    });

    const json = {
      name: 'Test Product',
      price: 42,
      description: 'A test product',
      inStock: true,
    };

    processor.processToken('```json\n');
    processor.processToken(JSON.stringify(json));
    processor.processToken('\n```');
    processor.end();

    expect(structured).toHaveLength(1);
    expect(structured[0]).toMatchObject(json);
  });
});

describe('processStream', () => {
  it('should process async stream', async () => {
    async function* mockStream() {
      yield 'Hello ';
      yield 'World';
    }

    const result = await streamToString(mockStream());
    expect(result).toBe('Hello World');
  });

  it('should handle JSON in stream', async () => {
    const json = {
      name: 'Test Product',
      price: 42,
      description: 'A test product',
      inStock: true,
    };

    async function* mockStream() {
      yield '```json\n';
      yield JSON.stringify(json);
      yield '\n```';
    }

    const structured: unknown[] = [];
    const processor = new StreamProcessor({
      schema: ProductSchema,
    });

    processor.on('structured', (data) => {
      structured.push(data);
    });

    for await (const chunk of processStream(mockStream(), { schema: ProductSchema })) {
      processor.processToken(chunk);
    }
    processor.end();

    expect(structured).toHaveLength(1);
    expect(structured[0]).toMatchObject(json);
  });
});
