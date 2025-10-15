import { describe, it, expect, beforeEach } from 'vitest';
import { FlowEngine } from '../engine';
import { MemoryStateStore } from '../storage/memory-storage';
import type { FlowDefinition, MessageIn, ExecutionContext } from '../types/shared';

describe('FlowEngine', () => {
  let engine: FlowEngine;
  let store: MemoryStateStore;
  let flow: FlowDefinition;
  let incoming: MessageIn;

  beforeEach(() => {
    store = new MemoryStateStore();
    
    flow = {
      id: 'test-flow',
      start: 'node1',
      nodes: [
        {
          id: 'node1',
          type: 'message',
          text: 'Hello {{incoming.text}}!',
          next: 'node2',
        },
        {
          id: 'node2',
          type: 'setVar',
          assigns: {
            counter: '1',
          },
          next: undefined,
        },
      ],
    };

    incoming = {
      channel: 'web',
      userId: 'user123',
      sessionId: 'session123',
      text: 'World',
    };

    engine = new FlowEngine(flow, { store });
  });

  it('should execute a simple flow', async () => {
    const outputs = [];
    
    for await (const output of engine.run(incoming)) {
      outputs.push(output);
    }

    expect(outputs).toHaveLength(1);
    expect(outputs[0]).toEqual({
      type: 'text',
      text: 'Hello World!',
    });

    const vars = await store.get('session123');
    expect(vars.counter).toBe(1);
  });

  it('should emit nodeStart and nodeEnd events', async () => {
    const events: string[] = [];
    
    engine.on('nodeStart', (nodeId) => {
      events.push(`start:${nodeId}`);
    });

    engine.on('nodeEnd', (nodeId) => {
      events.push(`end:${nodeId}`);
    });

    // Run the flow
    const outputs = [];
    for await (const output of engine.run(incoming)) {
      outputs.push(output);
    }

    expect(events).toEqual([
      'start:node1',
      'end:node1', 
      'start:node2',
      'end:node2',
    ]);
  });

  it('should emit output events', async () => {
    const outputEvents: any[] = [];
    
    engine.on('output', (msg, ctx) => {
      outputEvents.push({ msg, sessionId: ctx.incoming.sessionId });
    });

    // Run the flow
    for await (const output of engine.run(incoming)) {
    }

    expect(outputEvents).toHaveLength(1);
    expect(outputEvents[0].msg).toEqual({
      type: 'text',
      text: 'Hello World!',
    });
    expect(outputEvents[0].sessionId).toBe('session123');
  });

  it('should handle middleware', async () => {
    const middlewareLog: string[] = [];
    
    const middleware1 = async (ctx: ExecutionContext, next: () => Promise<void>) => {
      middlewareLog.push('middleware1-before');
      await next();
      middlewareLog.push('middleware1-after');
    };

    const middleware2 = async (ctx: ExecutionContext, next: () => Promise<void>) => {
      middlewareLog.push('middleware2-before');
      await next();
      middlewareLog.push('middleware2-after');
    };

    const engineWithMiddleware = new FlowEngine(flow, {
      store,
      middlewares: [middleware1, middleware2],
    });

    const outputs = [];
    for await (const output of engineWithMiddleware.run(incoming)) {
      outputs.push(output);
    }

    expect(middlewareLog).toEqual([
      'middleware1-before',
      'middleware2-before',
      'middleware2-after',
      'middleware1-after',
    ]);
  });

  it('should handle empty flow', async () => {
    const emptyFlow: FlowDefinition = {
      id: 'empty-flow',
      start: 'unknown',
      nodes: [],
    };

    const emptyEngine = new FlowEngine(emptyFlow, { store });
    const outputs = [];
    
    for await (const output of emptyEngine.run(incoming)) {
      outputs.push(output);
    }

    expect(outputs).toHaveLength(0);
  });

  it('should throw error for unknown node', async () => {
    const badFlow: FlowDefinition = {
      id: 'bad-flow',
      start: 'unknown',
      nodes: [],
    };

    const badEngine = new FlowEngine(badFlow, { store });

    await expect(async () => {
      for await (const output of badEngine.run(incoming)) {
        // Just consume outputs
      }
    }).rejects.toThrow('Node not found: unknown');
  });

  it('should preserve existing variables in state', async () => {
    // Set initial state
    await store.set('session123', { existingVar: 'preserved' });

    const outputs = [];
    for await (const output of engine.run(incoming)) {
      outputs.push(output);
    }

    // Verify both old and new variables exist
    const vars = await store.get('session123');
    expect(vars.existingVar).toBe('preserved');
    expect(vars.counter).toBe(1);
  });
});