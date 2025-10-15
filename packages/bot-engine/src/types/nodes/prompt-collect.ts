import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface PromptOption {
	label: string;
	value: string;
}

export interface PromptPicOption extends PromptOption {
	imageUrl: string;
}

export interface PromptCardOption extends PromptOption {
	imageUrl?: string;
	subtitle?: string;
	description?: string;
	actions?: { label: string; value: string }[];
}

export interface PromptValidation {
	required?: boolean;
	regex?: string;
	minLength?: number;
	maxLength?: number;
	message?: string;
}

export type PromptUI =
	| { kind: "text"; placeholder?: string; multiline?: boolean }
	| { kind: "number"; min?: number; max?: number; step?: number }
	| { kind: "email" }
	| { kind: "website" }
	| { kind: "date"; min?: string; max?: string }
	| { kind: "time" }
	| { kind: "phone" }
	| { kind: "buttons"; options: PromptOption[] }
	| { kind: "pic-choice"; options: PromptPicOption[] }
	| { kind: "rating"; scale: number; emoji?: string }
	| { kind: "file"; accept?: string[]; multiple?: boolean }
	| { kind: "cards"; cards: PromptCardOption[] }
	| { kind: "payment"; amountExpr: Expression; currency: string };

export interface PromptCollectNodeDef extends FlowNodeDefBase {
	type: "prompt-collect";
	prompt: Expression;
	var: string;
	ui: PromptUI;
	validate?: PromptValidation;
	retryPrompt?: Expression;
	maxRetries?: number;
	next?: string;
}
