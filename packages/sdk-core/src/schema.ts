import { z } from 'zod';
import { ValidationError } from './types';

/**
 * Converts a Zod schema to a human-readable string for model hints
 */
export function schemaToHuman(schema: z.ZodType<unknown>): string {
  if (schema instanceof z.ZodObject) {
    const fields = Object.entries(schema.shape)
      .map(([key, value]) => `${key}: ${schemaToHuman(value as z.ZodType)}`)
      .join('\n');
    return `{\n${fields}\n}`;
  }

  if (schema instanceof z.ZodString) {
    return 'string';
  }

  if (schema instanceof z.ZodNumber) {
    return 'number';
  }

  if (schema instanceof z.ZodBoolean) {
    return 'boolean';
  }

  if (schema instanceof z.ZodArray) {
    return `array of ${schemaToHuman(schema.element)}`;
  }

  if (schema instanceof z.ZodEnum) {
    return `one of [${schema.options.join(', ')}]`;
  }

  return 'any';
}

/**
 * Extracts JSON from a text block, handling various formats
 */
export function extractJson(text: string): string {
  // Look for JSON block between ``` or ```json
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1];
  }

  // Look for standalone JSON object/array
  const jsonMatch = text.match(/(\{[\s\S]*?\}|\[[\s\S]*?\])/);
  if (jsonMatch) {
    return jsonMatch[1];
  }

  throw new Error('No JSON found in response');
}

/**
 * Validates output against a schema, throwing ValidationError if invalid
 */
export function validateOutput<T>(output: string, schema: z.ZodType<T>): T {
  try {
    const jsonStr = extractJson(output);
    const parsed = JSON.parse(jsonStr);
    return schema.parse(parsed);
  } catch (e) {
    const error = e as Error;
    throw new ValidationError(
      'Output validation failed',
      output,
      [{ message: error.message }]
    );
  }
}

/**
 * Generates a schema hint for retry attempts
 */
export function generateSchemaHint(schema: z.ZodType<unknown>): string {
  return `
Please provide a valid JSON response matching this schema:
${schemaToHuman(schema)}

Format the response as a JSON code block like:
\`\`\`json
{
  // your response here
}
\`\`\`
`;
}
