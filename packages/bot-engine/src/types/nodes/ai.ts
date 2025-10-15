import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface AINodeDef extends FlowNodeDefBase {
	type: "ai";
	provider: "openai" | "anthropic" | string; // you implement adapter outside
	prompt: Expression; // resolved string
	assignTo?: string; // result text
	next?: string;
}
