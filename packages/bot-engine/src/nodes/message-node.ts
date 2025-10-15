import type { MessageNodeDef } from "../types/nodes/message";
import type { ExecutionContext, NodeResult } from "../types/shared";
import { template } from "../utils/template";
import { BaseNode } from "./base-node";

export class MessageNode extends BaseNode<MessageNodeDef> {
	async run(ctx: ExecutionContext): Promise<NodeResult> {
		const outputs = [] as NodeResult["outputs"];
		if (this.def.text) {
			outputs?.push({
				type: "text",
				text: template(this.def.text, { ...ctx.vars, incoming: ctx.incoming }),
			});
		}
		if (this.def.payload) {
			outputs?.push({ type: "payload", payload: this.def.payload });
		}
		return { outputs, next: this.def.next };
	}
}
