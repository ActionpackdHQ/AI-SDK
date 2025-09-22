# Actionpackd AI SDK

⚡ Tiny, schema-first SDK for building AI apps — typed outputs, streaming, flows, and provider-agnostic adapters.  
**2 lines to typed, streaming AI magic.**

[![npm version](https://img.shields.io/npm/v/@actionpackd/sdk-core)](https://www.npmjs.com/package/@actionpackd/sdk-core)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/ActionpackdHQ/AI-SDK/actions/workflows/ci.yml/badge.svg)](./.github/workflows/ci.yml)

---

## ✨ Features

- **`serverCompose`** → schema-validated outputs with [Zod](https://zod.dev) (no brittle JSON parsing)
- **`useCompose`** → stream tokens into UIs with optional structured events mid-stream
- **`flowBuilder`** → multi-step flows with built-in retries + typed outputs
- **Provider-agnostic** → plug in OpenAI, Anthropic, Gemini (adapters coming soon)
- **Mocks included** → instant demos and tests, no API keys required
- **Secure by default** → safe prompt interpolation, PII redaction, opt-in telemetry

---

## 🚀 Quickstart

Install:

```bash
pnpm add @actionpackd/sdk-core zod
```

Use:
```typescript
import { createProvider, serverCompose } from '@actionpackd/sdk-core';
import { z } from 'zod';

// Create a provider (use real adapters or mocks)
const openai = createProvider({ id: 'openai', apiKey: process.env.OPENAI_KEY });

// Define schema
const ProductSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()),
});

// Get typed output
const product = await serverCompose({
  provider: openai,
  prompt: 'Write product JSON for {{name}}',
  inputs: { name: 'Cord Jacket' },
  schema: ProductSchema,
});

console.log(product.title); // ✅ typed, validated
```

## 💻 Examples

- Simple demo → packages/sdk-core/examples/simple-demo.ts
- Next.js starter → packages/sdk-core/examples/next-starter/ (deploy to Vercel)
- Multi-model demo → run with pnpm demo:multi

## 📦 Packages

This repo is a monorepo managed with pnpm workspaces.

- @actionpackd/sdk-core → the core SDK (you're here)
- @actionpackd/provider-openai → adapter for OpenAI (coming soon)
- @actionpackd/provider-anthropic → adapter for Anthropic (coming soon)
- @actionpackd/provider-gemini → adapter for Gemini (coming soon)
- @actionpackd/ui → optional React UI components (future)

## 🔒 Security

- Safe template interpolation (no eval)
- Built-in PII redaction for logs
- Secrets scanning in CI
- Telemetry is opt-in only
- See SECURITY.md for details.

## 🤝 Contributing

We welcome issues and PRs! Please read our Contributing Guide.

## 📜 License

MIT © Actionpackd
