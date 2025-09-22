# Actionpackd AI SDK

2 lines to magic — typed, streaming AI outputs 🪄

A secure, well-tested TypeScript SDK for interacting with AI models, with built-in support for:
- Strong type safety with Zod schemas
- Streaming responses with structured data detection
- Safe template interpolation
- PII redaction and security best practices
- Multi-step flows with validation
- React hooks for client-side use
- Mock providers for easy testing and demos

## Quick Start

```bash
# Install
# Using npm
npm install @actionpackd/ai-sdk zod

# Using yarn
yarn add @actionpackd/ai-sdk zod

# Using pnpm
pnpm add @actionpackd/ai-sdk zod

# Try the demo
pnpm tsx examples/simple-demo.ts --provider openai
```

```typescript
import { createProvider, serverCompose } from '@actionpackd/ai-sdk';
import { z } from 'zod';

// Create a provider
const provider = createProvider({ id: 'openai' });

// Define your schema
const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
});

// Get typed, validated output
const product = await serverCompose(provider, 'Generate a product', {
  schema: ProductSchema
});
```

## Features

### 🔒 Security First

- No secrets in code - environment variables only
- Automated secrets scanning in CI
- PII redaction by default
- Safe template interpolation (no eval)
- Opt-in telemetry
- Strong output validation

### 🌊 Streaming Support

```typescript
// Server-side streaming
const stream = provider.generateStream('Tell me a story');
for await (const token of stream) {
  console.log(token);
}

// React hook with streaming
function Demo() {
  const { completion, isLoading } = useCompose('Tell me a story');
  return <div>{completion}</div>;
}
```

### 📝 Type Safety

```typescript
// Define schema
const StorySchema = z.object({
  title: z.string(),
  content: z.string(),
  genre: z.enum(['fiction', 'non-fiction']),
});

// Get typed output with validation
const story = await serverCompose(provider, 'Tell me a story', {
  schema: StorySchema,
  retries: 1, // Retry with schema hints if validation fails
});
```

### 🔄 Multi-step Flows

```typescript
const flow = flowBuilder(provider)
  .addStep({
    prompt: 'Generate a character',
    schema: CharacterSchema,
  })
  .addStep({
    prompt: 'Generate a story about {{results.step1.name}}',
    schema: StorySchema,
  });

const results = await flow.execute();
```

### 🎭 Mock Providers

The SDK includes mock providers for OpenAI, Anthropic, and Gemini that return realistic responses without making API calls. Perfect for:
- Development and testing
- CI environments
- Demos and examples

Try different providers:
```bash
# Try different mock providers
./examples/multi-model-demo.sh --provider openai
./examples/multi-model-demo.sh --provider anthropic
./examples/multi-model-demo.sh --provider gemini
```

### 🌐 Next.js Demo

A complete Next.js demo is included in `examples/next-starter` showing:
- API route setup
- Client-side streaming
- Provider switching
- Error handling

```bash
cd examples/next-starter
pnpm install
pnpm dev
```

## Security

See [SECURITY.md](../SECURITY.md) for:
- Threat model
- Security best practices
- Vulnerability reporting

## Adding Real Providers

To add a real provider (not included in core):

1. Implement the Provider interface:
```typescript
interface Provider {
  id: string;
  generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
  generateStream(prompt: string, options?: CompletionOptions): AsyncIterable<string>;
}
```

2. Create provider package:
```typescript
// @actionpackd/provider-openai
export class OpenAIProvider implements Provider {
  constructor(config: ProviderConfig) {
    // Initialize with API key etc
  }
  
  async generateCompletion(prompt: string) {
    // Call OpenAI API
  }
  
  async *generateStream(prompt: string) {
    // Stream from OpenAI API
  }
}
```

3. Use provider:
```typescript
import { OpenAIProvider } from '@actionpackd/provider-openai';

const provider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
});
```

## Migration Guide

Migrating from useChat/ai.chat:

```typescript
// Before
const { messages } = useChat();
ai.chat('Hello');

// After
const { completion } = useCompose('Hello');
await serverCompose(provider, 'Hello');
```

## Contributing

1. Fork repo
2. Create feature branch
3. Make changes
4. Add tests
5. Submit PR

## License

MIT
