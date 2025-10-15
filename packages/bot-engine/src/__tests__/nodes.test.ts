import { describe, it, expect } from 'vitest';
import { MessageNode } from '../nodes/message-node';
import { SetVarNode } from '../nodes/set-var-node';
import type { ExecutionContext } from '../types/shared';

describe('Node Types', () => {
  describe('MessageNode', () => {
    it('should output text message', async () => {
      const node = new MessageNode({
        id: 'msg1',
        type: 'message',
        text: 'Hello {{name}}!',
        next: 'next1'
      });

      const ctx: ExecutionContext = {
        flow: { id: 'test', start: 'msg1', nodes: [] },
        vars: { name: 'Alice' },
        incoming: { channel: 'web', userId: 'u1', sessionId: 's1', text: 'hi' },
        now: new Date()
      };

      const result = await node.run(ctx);

      expect(result.outputs).toHaveLength(1);
      expect(result.outputs?.[0]).toEqual({
        type: 'text',
        text: 'Hello Alice!'
      });
      expect(result.next).toBe('next1');
    });

    it('should output payload message', async () => {
      const payload = { action: 'show_menu', items: ['a', 'b'] };
      const node = new MessageNode({
        id: 'msg1',
        type: 'message',
        payload,
      });

      const ctx: ExecutionContext = {
        flow: { id: 'test', start: 'msg1', nodes: [] },
        vars: {},
        incoming: { channel: 'web', userId: 'u1', sessionId: 's1' },
        now: new Date()
      };

      const result = await node.run(ctx);

      expect(result.outputs).toHaveLength(1);
      expect(result.outputs?.[0]).toEqual({
        type: 'payload',
        payload
      });
    });

    it('should output both text and payload', async () => {
      const node = new MessageNode({
        id: 'msg1',
        type: 'message',
        text: 'Choose an option',
        payload: { options: ['yes', 'no'] }
      });

      const ctx: ExecutionContext = {
        flow: { id: 'test', start: 'msg1', nodes: [] },
        vars: {},
        incoming: { channel: 'web', userId: 'u1', sessionId: 's1' },
        now: new Date()
      };

      const result = await node.run(ctx);

      expect(result.outputs).toHaveLength(2);
      expect(result.outputs?.[0].type).toBe('text');
      expect(result.outputs?.[1].type).toBe('payload');
    });
  });

  describe('SetVarNode', () => {
    it('should set simple variable', async () => {
      const node = new SetVarNode({
        id: 'set1',
        type: 'setVar',
        assigns: {
          counter: '1',
          name: '"John"'
        },
        next: 'next1'
      });

      const ctx: ExecutionContext = {
        flow: { id: 'test', start: 'set1', nodes: [] },
        vars: {},
        incoming: { channel: 'web', userId: 'u1', sessionId: 's1' },
        now: new Date()
      };

      const result = await node.run(ctx);

      expect(ctx.vars.counter).toBe(1);
      expect(ctx.vars.name).toBe('John');
      expect(result.next).toBe('next1');
      expect(result.outputs).toBeUndefined();
    });

    it('should evaluate expressions with existing variables', async () => {
      const node = new SetVarNode({
        id: 'set1',
        type: 'setVar',
        assigns: {
          total: 'price * quantity',
          message: 'name + " ordered " + quantity + " items"'
        }
      });

      const ctx: ExecutionContext = {
        flow: { id: 'test', start: 'set1', nodes: [] },
        vars: { 
          price: 10,
          quantity: 3,
          name: 'Alice'
        },
        incoming: { channel: 'web', userId: 'u1', sessionId: 's1' },
        now: new Date()
      };

      const result = await node.run(ctx);

      expect(ctx.vars.total).toBe(30);
      expect(ctx.vars.message).toBe('Alice ordered 3 items');
    });

    it('should use incoming message data in expressions', async () => {
      const node = new SetVarNode({
        id: 'set1',
        type: 'setVar',
        assigns: {
          userInput: 'incoming.text',
          userId: 'incoming.userId'
        }
      });

      const ctx: ExecutionContext = {
        flow: { id: 'test', start: 'set1', nodes: [] },
        vars: {},
        incoming: { 
          channel: 'web', 
          userId: 'user123', 
          sessionId: 's1', 
          text: 'Hello there'
        },
        now: new Date()
      };

      const result = await node.run(ctx);

      expect(ctx.vars.userInput).toBe('Hello there');
      expect(ctx.vars.userId).toBe('user123');
    });
  });
});