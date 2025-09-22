# Actionpackd AI SDK Benchmarks

This directory contains benchmarks for measuring token throughput using mock providers.

## Running Benchmarks

```bash
# Install dependencies
pnpm install

# Run benchmarks
pnpm tsx benchmarks/token-throughput.ts
```

## Token Throughput Test

The benchmark measures:
1. Token generation speed (tokens/second)
2. JSON parsing and validation throughput
3. Streaming performance

Example output:
```
Token Generation Speed:
- OpenAI Mock: 1000 tokens/s
- Anthropic Mock: 950 tokens/s
- Gemini Mock: 975 tokens/s

JSON Processing:
- Parse + Validate: 5000 ops/s
- Schema Validation: 10000 ops/s

Streaming Performance:
- Token Stream Rate: 800 tokens/s
- Buffer Processing: 2000 ops/s
```

## Custom Benchmarks

You can create custom benchmarks by:

1. Creating a new benchmark file in this directory
2. Using the mock providers from `tests/mocks/providers.ts`
3. Running with `pnpm tsx benchmarks/your-benchmark.ts`

Example custom benchmark:
```typescript
import { createProvider } from '../src';
import { z } from 'zod';

async function runBenchmark() {
  const provider = createProvider({ id: 'openai' });
  const schema = z.object({ value: z.string() });
  
  console.time('completion');
  await provider.generateCompletion('test', { schema });
  console.timeEnd('completion');
}

runBenchmark().catch(console.error);
```
