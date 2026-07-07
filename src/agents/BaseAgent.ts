import type { AgentResponse } from "@/types";
import type { BaseTool } from "@/tools/BaseTool";

/**
 * Abstract base class for all Ippo agents.
 *
 * Provides execution trace tracking so every response includes
 * a full pipeline log for demo/debugging visibility.
 */
export abstract class BaseAgent {
  abstract name: string;
  abstract description: string;

  protected executionTrace: string[] = [];
  protected toolsUsed: string[] = [];

  /** Append a step to the execution trace. */
  protected addTrace(step: string): void {
    this.executionTrace.push(step);
  }

  /** Record a tool as used (deduplicated). */
  protected trackTool(tool: BaseTool): void {
    if (!this.toolsUsed.includes(tool.name)) {
      this.toolsUsed.push(tool.name);
    }
  }

  /** Build the standardised AgentResponse with trace data. */
  protected buildResponse(answer: string): AgentResponse {
    return {
      answer,
      agent: this.name,
      tools: [...this.toolsUsed],
      executionTrace: [...this.executionTrace],
    };
  }

  /** Reset trace state before each run. */
  protected resetTrace(): void {
    this.executionTrace = [];
    this.toolsUsed = [];
  }

  /**
   * Execute the agent's core logic.
   *
   * @param message   - The user's natural-language request
   * @param studentId - The ID of the student making the request
   */
  abstract run(message: string, studentId: string): Promise<AgentResponse>;
}
