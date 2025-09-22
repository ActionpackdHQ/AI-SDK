# Changelog

## [0.1.0] - 2025-09-21

### Added
- Initial release of @actionpackd/sdk-core
- Core functionality:
  - `createProvider` for provider instantiation
  - `serverCompose` for type-safe completions
  - `useCompose` React hook for client-side use
  - `flowBuilder` for multi-step flows
- Security features:
  - PII redaction
  - Secrets scanning
  - Safe template interpolation
  - Opt-in telemetry
- Mock providers:
  - OpenAI (JSON-focused responses)
  - Anthropic (verbose, human-like responses)
  - Gemini (balanced style)
- Examples:
  - Simple CLI demo
  - Next.js starter application
- Full test suite with fixtures

### Implementation Notes

#### Security Decisions
- Chose to implement PII redaction at multiple levels (logs, errors, telemetry)
- Used regex patterns for secrets detection to keep it simple but effective
- Implemented safe template interpolation without eval/Function
- Made telemetry opt-in only with self-hosting option

#### Provider Implementation
- Kept providers out of core package for security and maintainability
- Implemented mock providers with distinct "personalities":
  - OpenAI: Concise, JSON-focused
  - Anthropic: Verbose, explanatory
  - Gemini: Balanced approach
- Used fixed delays in mocks for predictable behavior

#### Testing Strategy
- Used Vitest for modern testing features
- Created reusable schemas in fixtures
- Focused on streaming and validation edge cases
- Kept tests deterministic (no real API calls)

#### Next.js Integration
- Used App Router for modern Next.js features
- Implemented streaming at API route level
- Added provider switching in UI
- Used Tailwind for styling

#### Dependencies
- Core: Only zod as runtime dependency
- Dev: Minimal set of modern tools
- Testing: Vitest for speed and features
