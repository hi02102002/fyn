import type { PromptCollectNodeDef } from "../types/nodes/prompt-collect";
import type { ExecutionContext, NodeResult, WaitForInput } from "../types/shared";
import { template } from "../utils/template";
import { BaseNode } from "./base-node";

export class PromptCollectNode extends BaseNode<PromptCollectNodeDef> {
  async run(ctx: ExecutionContext): Promise<NodeResult> {
    // Check if we're resuming from a waiting state
    if (ctx.waitingForInput?.nodeId === this.def.id) {
      return this.handleInputResume(ctx);
    }
    
    // Start new input collection
    return this.startInputCollection(ctx);
  }

  private startInputCollection(ctx: ExecutionContext): NodeResult {
    const promptText = template(this.def.prompt, { ...ctx.vars, incoming: ctx.incoming });
    
    const waitForInput: WaitForInput = {
      nodeId: this.def.id,
      variable: this.def.var,
      prompt: promptText,
      validation: this.def.validate,
      retryPrompt: this.def.retryPrompt ? template(this.def.retryPrompt, { ...ctx.vars, incoming: ctx.incoming }) : undefined,
      maxRetries: this.def.maxRetries ?? 3,
      currentRetries: 0,
    };

    return {
      waitForInput,
      outputs: [
        {
          type: 'text',
          text: promptText,
        },
        ...(this.def.ui ? [this.createUIOutput()] : []),
      ],
    };
  }

  private handleInputResume(ctx: ExecutionContext): NodeResult {
    const waitState = ctx.waitingForInput;
    if (!waitState) {
      throw new Error('No waiting state found for input resume');
    }
    
    const userInput = ctx.incoming.text || '';

    // Validate the input
    const validationError = this.validateInput(userInput, this.def);
    
    if (validationError) {
      // Input is invalid, check retry count
      const currentRetries = (waitState.currentRetries || 0) + 1;
      
      if (currentRetries >= (waitState.maxRetries || 3)) {
        // Max retries reached, move to next node or end flow
        return {
          next: this.def.next,
          outputs: [
            {
              type: 'text',
              text: 'Maximum retry attempts reached. Please try again later.',
            },
          ],
        };
      }

      // Retry with error message
      const retryPrompt = waitState.retryPrompt || waitState.prompt;
      const updatedWaitState: WaitForInput = {
        ...waitState,
        currentRetries,
      };

      return {
        waitForInput: updatedWaitState,
        outputs: [
          {
            type: 'text',
            text: validationError,
          },
          {
            type: 'text',
            text: retryPrompt,
          },
          ...(this.def.ui ? [this.createUIOutput()] : []),
        ],
      };
    }

    // Input is valid, store it and continue
    ctx.vars[this.def.var] = this.processInput(userInput);

    return {
      next: this.def.next,
      outputs: [],
    };
  }

  private createUIOutput() {
    return {
      type: 'payload' as const,
      payload: {
        type: 'ui',
        ui: this.def.ui,
      },
    };
  }

  private processInput(input: string): unknown {
    // Process input based on UI type
    switch (this.def.ui.kind) {
      case 'number':
        const num = parseFloat(input);
        return isNaN(num) ? input : num;
      
      case 'email':
      case 'website':
      case 'text':
      case 'phone':
        return input.trim();
      
      case 'date':
        const date = new Date(input);
        return isNaN(date.getTime()) ? input : date.toISOString().split('T')[0];
      
      case 'time':
        return input.trim();
      
      case 'buttons':
      case 'pic-choice':
        // For selection inputs, validate against options
        const options = 'options' in this.def.ui ? this.def.ui.options : [];
        const selectedOption = options.find(opt => opt.value === input);
        return selectedOption ? selectedOption.value : input;
      
      case 'rating':
        const rating = parseInt(input, 10);
        return isNaN(rating) ? input : Math.max(1, Math.min(rating, this.def.ui.scale));
      
      case 'cards':
        // Handle card selection
        return input;
      
      default:
        return input.trim();
    }
  }

  private validateInput(input: string, node: PromptCollectNodeDef): string | null {
    const v = node.validate

    if(!v) return null;

    if (v.required && !input) {
      return v.message || "This field is required."
    }

    if (v.minLength && input.length < v.minLength) {
      return v.message || `Must be at least ${v.minLength} characters.`
    }

    if (v.maxLength && input.length > v.maxLength) {
      return v.message || `Must be at most ${v.maxLength} characters.`
    }

    if(v.regex) {
      const re = new RegExp(v.regex);

      try {
        if(!re.test(input)) {
          return v.message || "Invalid format."
        }
      } catch {
        console.warn("Invalid regex in validate:", v.regex);
      }
    }

    return null;
  }
}
