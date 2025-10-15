import { ofetch } from "ofetch";
import type { HttpRequestNodeDef } from "../types/nodes/http-request";
import type { ExecutionContext, NodeResult } from "../types/shared";
import { evalExpr } from "../utils/eval-expr";
import { BaseNode } from "./base-node";

export class HttpRequestNode extends BaseNode<HttpRequestNodeDef> {
	async run(ctx: ExecutionContext): Promise<NodeResult> {
		const url = String(
			evalExpr(this.def.url, { ...ctx.vars, incoming: ctx.incoming }),
		);
		const headers = Object.fromEntries(
			Object.entries(this.def.headers ?? {}).map(([k, v]) => [
				k,
				String(evalExpr(v, { ...ctx.vars, incoming: ctx.incoming })),
			]),
		);
		const bodyExpr = this.def.body
			? evalExpr(this.def.body, { ...ctx.vars, incoming: ctx.incoming })
			: undefined;
		const hasBody = bodyExpr !== undefined && this.def.method !== "GET";
		const res = await ofetch(url, {
			method: this.def.method,
			headers: hasBody
				? { "content-type": "application/json", ...headers }
				: headers,
			body: hasBody
				? typeof bodyExpr === "string"
					? bodyExpr
					: JSON.stringify(bodyExpr)
				: undefined,
		});
		const contentType = res.headers.get("content-type") || "";
		const data = contentType.includes("application/json")
			? await res.json()
			: await res.text();
		if (this.def.assignTo) ctx.vars[this.def.assignTo] = data;
		return { next: this.def.next };
	}
}
