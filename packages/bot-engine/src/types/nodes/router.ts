import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface RouterNodeDef extends FlowNodeDefBase {
	type: "router";
	routes: { when: Expression; next: string }[];
	defaultNext?: string;
}
