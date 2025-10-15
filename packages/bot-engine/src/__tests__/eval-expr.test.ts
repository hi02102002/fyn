import { describe, it, expect } from 'vitest';
import { evalExpr } from '../utils/eval-expr';

describe('Expression Evaluator', () => {
  it('should evaluate simple arithmetic', () => {
    const result = evalExpr('1 + 2', {});
    expect(result).toBe(3);
  });

  it('should evaluate expressions with variables', () => {
    const result = evalExpr('a + b', { a: 5, b: 10 });
    expect(result).toBe(15);
  });

  it('should evaluate string operations', () => {
    const result = evalExpr('name + " " + surname', {
      name: 'John',
      surname: 'Doe'
    });
    expect(result).toBe('John Doe');
  });

  it('should evaluate boolean expressions', () => {
    const result = evalExpr('age >= 18', { age: 21 });
    expect(result).toBe(true);
  });

  it('should evaluate complex conditions', () => {
    const result = evalExpr('status === "active" && score > 50', {
      status: 'active',
      score: 75
    });
    expect(result).toBe(true);
  });

  it('should handle nested object properties', () => {
    const result = evalExpr('user.profile.age > 25', {
      user: {
        profile: {
          age: 30
        }
      }
    });
    expect(result).toBe(true);
  });

  it('should evaluate array operations', () => {
    const result = evalExpr('items.length > 0', {
      items: ['a', 'b', 'c']
    });
    expect(result).toBe(true);
  });

  it('should handle undefined variables gracefully', () => {
    // Should throw or return undefined for missing variables
    expect(() => evalExpr('missingVar + 1', {})).toThrow();
  });
});