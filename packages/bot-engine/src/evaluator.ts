import { ConditionNode } from "./nodes/condition-node";
import { HttpRequestNode } from "./nodes/http-request-node";
import { MessageNode } from "./nodes/message-node";
import { PromptCollectNode } from "./nodes/prompt-collect-node";
import { RouterNode } from "./nodes/router-node";
import { SetVarNode } from "./nodes/set-var-node";
import type { AnyNodeDef } from "./types/nodes/any";

export const createNode = (def: AnyNodeDef) => {
  switch (def.type) {
    case 'message':
      return new MessageNode(def);
    case 'prompt-collect':
      return new PromptCollectNode(def);
    case 'setVar':
      return new SetVarNode(def);
    case 'condition':
      return new ConditionNode(def);
    case 'http':
      return new HttpRequestNode(def);
    case 'router':
      return new RouterNode (def);
    default:
      throw new Error(`Unknown node type: ${(def).type}`);
  }
}