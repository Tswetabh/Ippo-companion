/** Result returned by every tool execution */
export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
}

/**
 * Abstract base class for all Ippo tools.
 * Every tool has a name, description, and an execute method.
 */
export abstract class BaseTool {
  abstract name: string;
  abstract description: string;

  abstract execute(params: Record<string, unknown>): Promise<ToolResult>;
}
