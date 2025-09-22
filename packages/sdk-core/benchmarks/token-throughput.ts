import { z } from 'zod';
import { MockOpenAIProvider, MockAnthropicProvider, MockGeminiProvider } from '../tests/mocks/providers';

const ITERATIONS = 1000;
const TEST_SCHEMA = z.object({
  title: z.string(),
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    active: z.boolean(),
  })),
});

async function measureTokenGeneration(provider: MockOpenAIProvider | MockAnthropicProvider | MockGeminiProvider) {
  const start = performance.now();
  
  for (let i = 0; i < ITERATIONS; i++) {
    await provider.generateCompletion('test prompt', { schema: TEST_SCHEMA, retries: 0, temperature: 0.7 });
  }
  
  const end = performance.now();
  const tokensPerSecond = ITERATIONS / ((end - start) / 1000);
  
  return tokensPerSecond;
}

async function measureStreamingPerformance(provider: MockOpenAIProvider | MockAnthropicProvider | MockGeminiProvider) {
  const start = performance.now();
  let tokenCount = 0;
  
  for (let i = 0; i < ITERATIONS; i++) {
    for await (const token of provider.generateStream('test prompt', { schema: TEST_SCHEMA, retries: 0, temperature: 0.7 })) {
      tokenCount += token.length;
    }
  }
  
  const end = performance.now();
  const tokensPerSecond = tokenCount / ((end - start) / 1000);
  
  return tokensPerSecond;
}

async function runBenchmarks() {
  console.log('Running benchmarks...\n');
  
  // Token generation speed
  const providers = {
    'OpenAI Mock': new MockOpenAIProvider({ id: 'openai', temperature: 0.7 }),
    'Anthropic Mock': new MockAnthropicProvider({ id: 'anthropic', temperature: 0.7 }),
    'Gemini Mock': new MockGeminiProvider({ id: 'gemini', temperature: 0.7 }),
  };
  
  console.log('Token Generation Speed:');
  for (const [name, provider] of Object.entries(providers)) {
    const tokensPerSecond = await measureTokenGeneration(provider);
    console.log(`- ${name}: ${tokensPerSecond.toFixed(0)} tokens/s`);
  }
  
  console.log('\nStreaming Performance:');
  for (const [name, provider] of Object.entries(providers)) {
    const tokensPerSecond = await measureStreamingPerformance(provider);
    console.log(`- ${name}: ${tokensPerSecond.toFixed(0)} tokens/s`);
  }
}

runBenchmarks().catch(console.error);
