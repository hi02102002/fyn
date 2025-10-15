import type { AnyNodeDef } from "../types/nodes/any";
import type { ExecutionContext, NodeResult } from "../types/shared";

export abstract class BaseNode<T extends AnyNodeDef = AnyNodeDef> {
	constructor(public readonly def: T) {}
	abstract run(ctx: ExecutionContext): Promise<NodeResult>;
}
