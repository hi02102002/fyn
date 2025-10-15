import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryStateStore } from '../storage/memory-storage';
import type { Vars } from '../types/shared';

describe('MemoryStateStore', () => {
  let store: MemoryStateStore;

  beforeEach(() => {
    store = new MemoryStateStore();
  });

  it('should return empty object for new session', async () => {
    const vars = await store.get('new-session');
    expect(vars).toEqual({});
  });

  it('should store and retrieve variables', async () => {
    const sessionId = 'session-1';
    const vars: Vars = { name: 'John', age: 30 };

    await store.set(sessionId, vars);
    const retrieved = await store.get(sessionId);

    expect(retrieved).toEqual(vars);
  });

  it('should overwrite existing variables', async () => {
    const sessionId = 'session-1';
    
    await store.set(sessionId, { name: 'John' });
    await store.set(sessionId, { name: 'Jane', age: 25 });
    
    const retrieved = await store.get(sessionId);
    expect(retrieved).toEqual({ name: 'Jane', age: 25 });
  });

  it('should handle multiple sessions independently', async () => {
    await store.set('session-1', { name: 'Alice' });
    await store.set('session-2', { name: 'Bob' });

    const session1 = await store.get('session-1');
    const session2 = await store.get('session-2');

    expect(session1).toEqual({ name: 'Alice' });
    expect(session2).toEqual({ name: 'Bob' });
  });

  it('should handle patch operation', async () => {
    const sessionId = 'session-1';
    
    await store.set(sessionId, { name: 'John', age: 30 });
    await store.patch(sessionId, { age: 31, city: 'New York' });
    
    const retrieved = await store.get(sessionId);
    expect(retrieved).toEqual({ name: 'John', age: 31, city: 'New York' });
  });

  it('should create new session when patching non-existent session', async () => {
    await store.patch('new-session', { name: 'Jane' });
    
    const retrieved = await store.get('new-session');
    expect(retrieved).toEqual({ name: 'Jane' });
  });

  it('should handle complex variable types', async () => {
    const sessionId = 'session-1';
    const complexVars: Vars = {
      user: { id: 1, profile: { name: 'Alice', settings: { theme: 'dark' } } },
      items: [1, 2, 3],
      metadata: { created: new Date('2024-01-01'), active: true }
    };

    await store.set(sessionId, complexVars);
    const retrieved = await store.get(sessionId);

    expect(retrieved).toEqual(complexVars);
  });

  it('should allow custom initial data', async () => {
    const initialData = new Map([
      ['session-1', { name: 'Existing User' }]
    ]);
    
    const customStore = new MemoryStateStore(initialData);
    const retrieved = await customStore.get('session-1');
    
    expect(retrieved).toEqual({ name: 'Existing User' });
  });
});