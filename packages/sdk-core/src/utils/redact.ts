/**
 * PII redaction patterns
 */
const PATTERNS = {
  // Email addresses
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // Phone numbers (various formats)
  PHONE: /(?:\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g,
  
  // Credit card like numbers (12-16 digits)
  CARD_LIKE: /\b\d{12,16}\b/g,
  
  // API keys and tokens (common patterns)
  API_KEY: /(?:api[_-]?key|token)['"\s]*[:=]\s*['"\s]*\w{20,}/gi,
  
  // Private keys
  PRIVATE_KEY: /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
};

/**
 * Redacts PII from text using replacement patterns
 */
export function redactPII(text: string): string {
  let redacted = text;
  
  // Replace each pattern with a redacted version
  redacted = redacted.replace(PATTERNS.EMAIL, '[EMAIL_REDACTED]');
  redacted = redacted.replace(PATTERNS.PHONE, '[PHONE_REDACTED]');
  redacted = redacted.replace(PATTERNS.CARD_LIKE, '[CARD_NUMBER_REDACTED]');
  redacted = redacted.replace(PATTERNS.API_KEY, '[API_KEY_REDACTED]');
  redacted = redacted.replace(PATTERNS.PRIVATE_KEY, '[PRIVATE_KEY_REDACTED]');
  
  return redacted;
}

/**
 * Checks if text contains any sensitive information
 */
export function containsSensitiveInfo(text: string): boolean {
  return (
    PATTERNS.EMAIL.test(text) ||
    PATTERNS.PHONE.test(text) ||
    PATTERNS.CARD_LIKE.test(text) ||
    PATTERNS.API_KEY.test(text) ||
    PATTERNS.PRIVATE_KEY.test(text)
  );
}

/**
 * Redacts sensitive information from error messages
 */
export function redactError(error: Error): Error {
  const redactedMessage = redactPII(error.message);
  const newError = new Error(redactedMessage);
  newError.name = error.name;
  newError.stack = redactPII(error.stack || '');
  return newError;
}
