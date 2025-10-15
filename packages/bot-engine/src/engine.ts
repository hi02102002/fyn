import EventEmitter from "eventemitter3";
import type { ExecutionContext, FlowDefinition, MessageIn, MessageOut, StateStore, Vars } from "./types/shared";
import { createNode } from "./evaluator";

export interface EngineOptions {
  store: StateStore;
  middlewares?: ((ctx: ExecutionContext, next: () => Promise<void>) => Promise<void>)[];
}

export class FlowEngine extends EventEmitter<{
  nodeStart: [nodeId: string, ctx: ExecutionContext];
  nodeEnd: [nodeId: string, ctx: ExecutionContext];
  output: [msg: MessageOut, ctx: ExecutionContext];
}> {
  constructor(private flow: FlowDefinition, private opts: EngineOptions) {
    super();
  }

  async *run(incoming: MessageIn): AsyncGenerator<MessageOut, void, void> {
    const vars: Vars = await this.opts.store.get(incoming.sessionId);

    const ctx: ExecutionContext = {
      flow: this.flow,
      vars,
      incoming,
      now: new Date(),
    };

    let nextId: string | undefined = this.flow.start;
    const idToNode = new Map(this.flow.nodes.map((n) => [n.id, n] as const));
    const outputs: MessageOut[] = [];
    const self = this;

    const applyMiddlewares = async (fn: () => Promise<void>) => {
      const mws = this.opts.middlewares ?? [];
      let idx = -1;
      const runner = async (i: number): Promise<void> => {
        if (i <= idx) throw new Error('next() called multiple times');
        idx = i;
        const mw = mws[i];
        if (mw) await mw(ctx, () => runner(i + 1));
        else await fn();
      };
      await runner(0);
    };

    async function *nodeRunner() {
      while (nextId) {
        const def = idToNode.get(nextId);
        if (!def) throw new Error(`Node not found: ${nextId}`);
        self.emit('nodeStart', def.id, ctx);
        const node = createNode(def);
        const res = await node.run(ctx);
        self.emit('nodeEnd', def.id, ctx);
        for (const out of res.outputs ?? []) {
          self.emit('output', out, ctx);
          yield out;
        }
        nextId = res.next;
      }
    }

    await applyMiddlewares(async () => {
      for await (const out of nodeRunner()) {
        outputs.push(out);
      }
    });

    for (const out of outputs) {
      yield out;
    }

    await this.opts.store.set(incoming.sessionId, ctx.vars);
  }
}