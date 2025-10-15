import type { ConditionNodeDef } from "../types/nodes/condition";
import type { ExecutionContext, NodeResult } from "../types/shared";
import { evalExpr } from "../utils/eval-expr";
import { BaseNode } from "./base-node";

export class ConditionNode extends BaseNode<ConditionNodeDef> {
	async run(ctx: ExecutionContext): Promise<NodeResult> {
		const ok = !!evalExpr(this.def.when, {
			...ctx.vars,
			incoming: ctx.incoming,
		});
		return { next: ok ? this.def.then : this.def.else };
	}
}
