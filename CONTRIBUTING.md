# Contributing to Actionpackd AI SDK

🎉 First off, thanks for taking the time to contribute! 

## Quick Start

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Run tests: `pnpm test`
5. Create a branch: `git checkout -b my-feature`

## Development Workflow

This is a monorepo using pnpm workspaces. Here's how to work with it:

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build

# Run acceptance checks (install, test, build, demo, secrets, lint, audit)
./scripts/check-all.sh

# Run demos
pnpm demo:simple  # Run simple demo
pnpm demo:multi   # Run multi-model demo
cd packages/sdk-core/examples/next-starter && pnpm dev  # Run Next.js demo
```

## Project Structure

```
packages/
  sdk-core/          # Main SDK package
    src/             # Source code
    tests/           # Tests
    examples/        # Example apps
    benchmarks/      # Performance tests
```

## Pull Request Process

1. Create an issue first (if one doesn't exist)
2. Fork the repo and create your branch from `main`
3. Make your changes
4. Run `pnpm test` and `pnpm build` to ensure everything works
5. Update documentation if needed
6. Submit PR with clear description of changes

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: bug fix
docs: documentation changes
test: add missing tests
chore: maintenance tasks
```

## Code Style

- TypeScript for all new code
- Prettier for formatting (`pnpm format`)
- ESLint for linting (`pnpm lint`)
- Tests required for new features
- JSDoc comments for public APIs

## Testing

- Write unit tests for new features
- Use mocks from `tests/mocks` for providers
- Run `pnpm test` before submitting PR
- Maintain >90% coverage

## Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Include examples in `/examples`
- Keep changelog updated

## Questions?

Feel free to:
- Open an issue
- Start a discussion
- Join our Discord community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
