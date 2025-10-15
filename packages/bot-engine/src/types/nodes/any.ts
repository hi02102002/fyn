import type { AINodeDef } from "./ai";
import type { ConditionNodeDef } from "./condition";
import type { HttpRequestNodeDef } from "./http-request";
import type { MediaNodeDef } from "./media";
import type { MessageNodeDef } from "./message";
import type { PromptCollectNodeDef } from "./prompt-collect";
import type { RouterNodeDef } from "./router";
import type { SetVarNodeDef } from "./set-var";
import type { WebhookNodeDef } from "./webhook";

export type AnyNodeDef =
	| MessageNodeDef
	| RouterNodeDef
	| ConditionNodeDef
	| SetVarNodeDef
	| HttpRequestNodeDef
	| WebhookNodeDef
	| AINodeDef
	| MediaNodeDef
	| PromptCollectNodeDef;
