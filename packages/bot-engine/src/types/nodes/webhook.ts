import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface WebhookNodeDef extends FlowNodeDefBase {
	type: "webhook";
	url: Expression;
	secret?: Expression; // sign if needed
	payload?: Expression;
	next?: string;
}
