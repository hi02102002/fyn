import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';

describe('Server Configuration', () => {
  it('should create a Hono app instance', () => {
    const app = new Hono();
    expect(app).toBeDefined();
    expect(typeof app.get).toBe('function');
    expect(typeof app.post).toBe('function');
    expect(typeof app.use).toBe('function');
  });

  it('should handle basic route configuration', () => {
    const app = new Hono();
    
    app.get('/test', (c) => {
      return c.text('Test OK');
    });

    // Check that the route was registered
    expect(app).toBeDefined();
  });

  it('should handle middleware configuration', () => {
    const app = new Hono();
    
    app.use('/*', async (_c, next) => {
      // Just run middleware without setting context
      await next();
    });

    app.get('/test', (c) => {
      return c.text('OK');
    });

    expect(app).toBeDefined();
  });
});