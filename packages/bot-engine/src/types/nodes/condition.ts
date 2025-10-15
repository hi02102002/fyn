import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface ConditionNodeDef extends FlowNodeDefBase {
	type: "condition";
	when: Expression;
	then: string;
	else?: string;
}
