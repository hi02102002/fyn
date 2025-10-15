import { describe, it, expect } from 'vitest';
import { appRouter } from '@fyn/api/routers/index';

describe('App Router Structure', () => {
  it('should have healthCheck procedure', () => {
    expect(appRouter.healthCheck).toBeDefined();
    expect(typeof appRouter.healthCheck).toBe('object');
  });

  it('should have serverTime procedure', () => {
    expect(appRouter.serverTime).toBeDefined();
    expect(typeof appRouter.serverTime).toBe('object');
  });

  it('should have privateData procedure', () => {
    expect(appRouter.privateData).toBeDefined();
    expect(typeof appRouter.privateData).toBe('object');
  });

  it('should export router with correct structure', () => {
    const routerKeys = Object.keys(appRouter);
    expect(routerKeys).toContain('healthCheck');
    expect(routerKeys).toContain('serverTime'); 
    expect(routerKeys).toContain('privateData');
  });
});