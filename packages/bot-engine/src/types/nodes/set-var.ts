import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface SetVarNodeDef extends FlowNodeDefBase {
	type: "setVar";
	assigns: Record<string, Expression>; // varName -> expression
	next?: string;
}
