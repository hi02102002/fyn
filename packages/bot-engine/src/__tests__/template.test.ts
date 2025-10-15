import { describe, it, expect } from 'vitest';
import { template } from '../utils/template';

describe('Template Utility', () => {
  it('should replace simple variables', () => {
    const result = template('Hello {{name}}!', { name: 'World' });
    expect(result).toBe('Hello World!');
  });

  it('should replace nested object properties', () => {
    const result = template('User: {{user.name}} ({{user.id}})', {
      user: { name: 'John', id: 123 }
    });
    expect(result).toBe('User: John (123)');
  });

  it('should handle missing properties gracefully', () => {
    const result = template('Hello {{missing}}!', {});
    expect(result).toBe('Hello !');
  });

  it('should handle null/undefined values', () => {
    const result = template('Value: {{value}}', { value: null });
    expect(result).toBe('Value: ');
  });

  it('should handle multiple variables', () => {
    const result = template('{{greeting}} {{name}}, age: {{age}}', {
      greeting: 'Hello',
      name: 'Alice',
      age: 30
    });
    expect(result).toBe('Hello Alice, age: 30');
  });

  it('should handle whitespace in placeholders', () => {
    const result = template('{{ greeting }} {{ name }}!', {
      greeting: 'Hi',
      name: 'Bob'
    });
    expect(result).toBe('Hi Bob!');
  });

  it('should convert non-string values to strings', () => {
    const result = template('Number: {{num}}, Boolean: {{bool}}', {
      num: 42,
      bool: true
    });
    expect(result).toBe('Number: 42, Boolean: true');
  });
});