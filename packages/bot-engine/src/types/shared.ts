import type { AnyNodeDef } from "./nodes/any";

export type Channel = "web" | "messenger" | "zalo" | "slack";

export interface MessageIn {
	channel: Channel;
	userId: string;
	sessionId: string;
	text?: string;
	payload?: Record<string, unknown>;
}

export interface MessageOut {
	type: "text" | "payload";
	text?: string;
	payload?: Record<string, unknown>;
}

export type Vars = Record<string, unknown>;

export interface NodeResult {
	next?: string; // next node id
	outputs?: MessageOut[];
	waitForInput?: WaitForInput; // Pause execution and wait for user input
}

export interface WaitForInput {
	nodeId: string; // Node that is waiting for input
	variable: string; // Variable name to store the input
	prompt: string; // Prompt message to show user
	validation?: {
		required?: boolean;
		regex?: string;
		minLength?: number;
		maxLength?: number;
		message?: string;
	};
	retryPrompt?: string;
	maxRetries?: number;
	currentRetries?: number;
}

export type Expression = string;

export interface FlowDefinition {
	id: string;
	name?: string;
	start: string; // node id
	nodes: AnyNodeDef[];
}

export interface ExecutionContext {
	flow: FlowDefinition;
	vars: Vars;
	incoming: MessageIn;
	now: Date;
	waitingForInput?: WaitForInput; // Current waiting state
}

export interface ExecutionState {
	sessionId: string;
	vars: Vars;
	waitingForInput?: WaitForInput;
	currentNodeId?: string;
}

export interface StateStore {
	get(sessionId: string): Promise<Vars>;
	set(sessionId: string, vars: Vars): Promise<void>;
	patch(sessionId: string, patch: Vars): Promise<void>;
	getExecutionState?(sessionId: string): Promise<ExecutionState | null>;
	setExecutionState?(sessionId: string, state: ExecutionState): Promise<void>;
}

export type MiddlewareFn = (
	ctx: ExecutionContext,
	next: () => Promise<void>,
) => Promise<void>;
