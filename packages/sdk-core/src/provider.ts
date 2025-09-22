import { Provider, ProviderConfig, ProviderError } from './types';

/**
 * Create a provider instance based on configuration.
 * Note: This is a stub implementation. In production, you would
 * import and return real provider implementations.
 */
export function createProvider(config: ProviderConfig): Provider {
  // This would normally instantiate real provider implementations
  // For testing and examples, use the mock providers from tests/mocks
  throw new ProviderError(
    'No provider implementation available. Use mock providers from tests/mocks for development.',
    config.id
  );
}
