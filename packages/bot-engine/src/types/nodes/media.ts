import type { Expression } from "../shared";
import type { FlowNodeDefBase } from "./base";

export interface MediaNodeDef extends FlowNodeDefBase {
	type: "media";
	mediaUrl: Expression; // can use vars
	mediaType: "image" | "video" | "audio" | "file";
	caption?: Expression; // can use vars
	next?: string;
}
