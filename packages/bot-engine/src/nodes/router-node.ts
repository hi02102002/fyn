import type { RouterNodeDef } from "../types/nodes/router";
import type { ExecutionContext, NodeResult } from "../types/shared";
import { evalExpr } from "../utils/eval-expr";
import { BaseNode } from "./base-node";

export class RouterNode extends BaseNode<RouterNodeDef> {
	async run(ctx: ExecutionContext): Promise<NodeResult> {
		for (const r of this.def.routes) {
			const ok = !!evalExpr(r.when, { ...ctx.vars, incoming: ctx.incoming });
			if (ok) return { next: r.next };
		}
		return { next: this.def.defaultNext };
	}
}
