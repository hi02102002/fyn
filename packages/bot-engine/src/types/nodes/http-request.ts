import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface HttpRequestNodeDef extends FlowNodeDefBase {
	type: "http";
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	url: Expression; // can use vars
	headers?: Record<string, Expression>;
	body?: Expression; // object/string
	assignTo?: string; // where to store response json
	next?: string;
}
