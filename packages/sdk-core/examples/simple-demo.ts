import { serverCompose } from '../src';
import { ProductSchema, StorySchema, IntentSchema } from '../tests/fixtures/schemas';
import { MockOpenAIProvider, MockAnthropicProvider, MockGeminiProvider } from '../tests/mocks/providers';

async function main() {
  // Get provider from command line args or env
  const providerId = process.argv.includes('--provider')
    ? process.argv[process.argv.indexOf('--provider') + 1]
    : process.env.DEMO_PROVIDER || 'openai';

  console.log(`Using provider: ${providerId}`);
  
  let provider;
  switch (providerId) {
    case 'openai':
      provider = new MockOpenAIProvider({ id: providerId, temperature: 0.7 });
      break;
    case 'anthropic':
      provider = new MockAnthropicProvider({ id: providerId, temperature: 0.7 });
      break;
    case 'gemini':
      provider = new MockGeminiProvider({ id: providerId, temperature: 0.7 });
      break;
    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }

  // Demo 1: Product JSON
  console.log('\n🛍️  Demo 1: E-commerce Product');
  const product = await serverCompose(
    provider,
    'Generate a product listing for a high-tech gadget',
    { schema: ProductSchema, temperature: 0.7, retries: 0 }
  );
  console.log(JSON.stringify(product, null, 2));

  // Demo 2: Streaming Story
  console.log('\n📚 Demo 2: Streaming Story');
  const story = provider.generateStream(
    'Tell me a very short story about AI',
    { schema: StorySchema, temperature: 0.7, retries: 0 }
  );

  for await (const token of story) {
    process.stdout.write(token);
  }
  console.log('\n');

  // Demo 3: Intent Extraction
  console.log('\n🎯 Demo 3: Intent Extraction');
  const intent = await serverCompose(
    provider,
    'Extract intent from: "I want to buy a new laptop under $1000"',
    { schema: IntentSchema, temperature: 0.7, retries: 0 }
  );
  console.log(JSON.stringify(intent, null, 2));
}

main().catch(console.error);
