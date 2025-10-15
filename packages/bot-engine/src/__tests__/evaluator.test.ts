import { describe, it, expect } from 'vitest';
import { createNode } from '../evaluator';
import { MessageNode } from '../nodes/message-node';
import { SetVarNode } from '../nodes/set-var-node';
import { ConditionNode } from '../nodes/condition-node';
import { HttpRequestNode } from '../nodes/http-request-node';
import { RouterNode } from '../nodes/router-node';
import { PromptCollectNode } from '../nodes/prompt-collect-node';

describe('Node Evaluator', () => {
  it('should create MessageNode for message type', () => {
    const def = {
      id: 'msg1',
      type: 'message' as const,
      text: 'Hello'
    };

    const node = createNode(def);
    expect(node).toBeInstanceOf(MessageNode);
  });

  it('should create SetVarNode for setVar type', () => {
    const def = {
      id: 'set1',
      type: 'setVar' as const,
      assigns: { x: '1' }
    };

    const node = createNode(def);
    expect(node).toBeInstanceOf(SetVarNode);
  });

  it('should create ConditionNode for condition type', () => {
    const def = {
      id: 'cond1',
      type: 'condition' as const,
      condition: 'true',
      ifTrue: 'next1',
      ifFalse: 'next2'
    };

    const node = createNode(def);
    expect(node).toBeInstanceOf(ConditionNode);
  });

  it('should create HttpRequestNode for http type', () => {
    const def = {
      id: 'http1',
      type: 'http' as const,
      url: 'https://api.example.com',
      method: 'GET' as const
    };

    const node = createNode(def);
    expect(node).toBeInstanceOf(HttpRequestNode);
  });

  it('should create RouterNode for router type', () => {
    const def = {
      id: 'router1',
      type: 'router' as const,
      routes: []
    };

    const node = createNode(def);
    expect(node).toBeInstanceOf(RouterNode);
  });

  it('should create PromptCollectNode for prompt-collect type', () => {
    const def = {
      id: 'prompt1',
      type: 'prompt-collect' as const,
      storeAs: 'userInput'
    };

    const node = createNode(def);
    expect(node).toBeInstanceOf(PromptCollectNode);
  });

  it('should throw error for unknown node type', () => {
    const def = {
      id: 'unknown1',
      type: 'unknown' as any
    };

    expect(() => createNode(def)).toThrow('Unknown node type: unknown');
  });
});