# Security Policy

## Threat Model

### Key Security Concerns

1. **API Key Leakage**
   - Risk: Exposure of provider API keys in code, logs, or error messages
   - Mitigation: 
     - Environment variables only
     - Automated secrets scanning in CI
     - No API keys in error messages or logs
     - `.env.example` with placeholders only

2. **Prompt Injection**
   - Risk: Malicious input manipulating model behavior
   - Mitigation:
     - Input validation and sanitization
     - Safe template interpolation (no eval)
     - Schema validation of outputs
     - Documentation of safe practices

3. **Model Hallucination**
   - Risk: Models generating invalid or harmful outputs
   - Mitigation:
     - Strong output validation with zod schemas
     - Retry logic with schema hints
     - No execution of model-generated code

4. **Data Exfiltration**
   - Risk: Sensitive data leaking through prompts or logs
   - Mitigation:
     - PII redaction by default
     - Opt-in telemetry only
     - Safe logging practices
     - Data retention policies

5. **Supply Chain**
   - Risk: Compromised dependencies
   - Mitigation:
     - Regular dependency audits
     - Minimal dependencies
     - Dependabot alerts
     - Lock files committed

### Security Features

1. **PII Redaction**
   - Automatic redaction of emails, phone numbers, and sensitive sequences
   - Applied to all logs and telemetry

2. **Telemetry**
   - Disabled by default
   - Opt-in only with explicit configuration
   - Self-hosted option available

3. **Logging**
   - Safe defaults that exclude sensitive data
   - Debug mode requires explicit activation
   - PII redaction applied to all logs

4. **Input/Output Safety**
   - Template interpolation without eval()
   - Strong schema validation
   - Safe retry mechanisms

## Reporting a Vulnerability

Please report security vulnerabilities to ram@actionpackd.com

We will acknowledge receipt within 24 hours and provide a detailed response within 48 hours, including:
- Confirmation of the issue
- Our planned steps to address it
- Expected timeline for patches

Please DO NOT file public issues for security vulnerabilities.

## Security Best Practices

1. Always use environment variables for API keys
2. Enable PII redaction in production
3. Review model outputs before using them
4. Keep dependencies updated
5. Run security audits regularly
6. Monitor logs for unusual patterns
7. Use the provided security utilities

## Compliance

This project follows these security standards:
- OWASP Secure Coding Guidelines
- npm Security Best Practices
- AI Security Best Practices (as defined by OpenAI and Anthropic)
