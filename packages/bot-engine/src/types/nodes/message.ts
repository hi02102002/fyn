import type { FlowNodeDefBase } from "./base";

export interface MessageNodeDef extends FlowNodeDefBase {
	type: "message";
	text?: string; // template supports {{var}}
	payload?: Record<string, unknown>;
	next?: string;
}
