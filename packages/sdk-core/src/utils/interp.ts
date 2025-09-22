/**
 * Safe template interpolation without eval
 * Only supports {{var}} syntax with dot paths
 */
export function interpolate(template: string, variables: Record<string, unknown>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const keys = path.trim().split('.');
    let value: unknown = variables;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return ''; // Return empty string for undefined variables
      }
    }
    
    // Convert value to string safely
    if (typeof value === 'string') {
      return value;
    }
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Object]';
      }
    }
    return String(value);
  });
}

/**
 * Validates that a template only uses the safe {{var}} syntax
 */
export function validateTemplate(template: string): boolean {
  // Check for potentially unsafe patterns
  const unsafePatterns = [
    /\$\{.*\}/,  // ${} syntax
    /eval\(.*\)/, // eval()
    /new Function/, // Function constructor
    /\(\).*=>/, // Arrow functions
    /function.*\(.*\)/, // Function declarations
  ];
  
  return !unsafePatterns.some(pattern => pattern.test(template));
}

/**
 * Extracts variable names from a template
 */
export function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{([^}]+)\}\}/g) || [];
  return matches
    .map(match => match.slice(2, -2).trim())
    .filter((value, index, self) => self.indexOf(value) === index);
}
