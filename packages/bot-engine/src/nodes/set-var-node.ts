import type { SetVarNodeDef } from "../types/nodes/set-var";
import type { ExecutionContext, NodeResult } from "../types/shared";
import { evalExpr } from "../utils/eval-expr";
import { BaseNode } from "./base-node";

export class SetVarNode extends BaseNode<SetVarNodeDef> {
	async run(ctx: ExecutionContext): Promise<NodeResult> {
		const assigns = Object.fromEntries(
			Object.entries(this.def.assigns).map(([k, expr]) => [
				k,
				evalExpr(expr, { ...ctx.vars, incoming: ctx.incoming }),
			]),
		);
		Object.assign(ctx.vars, assigns);
		return { next: this.def.next };
	}
}
