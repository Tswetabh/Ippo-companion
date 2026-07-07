import type { AgentResponse } from "@/types";
import type { BaseAgent } from "@/agents/BaseAgent";
import { PlannerAgent } from "@/agents/PlannerAgent";
import { AcademicAgent } from "@/agents/AcademicAgent";
import { AttendanceAgent } from "@/agents/AttendanceAgent";
import { generateResponse, generateStructuredResponse } from "@/lib/gemini";

type AgentType = "planner" | "academic" | "attendance";

interface RoutingDecision {
  selectedAgents: AgentType[];
  executionOrder: AgentType[];
  reasoning: string;
}

const routingSchema = {
  type: "OBJECT",
  properties: {
    selectedAgents: {
      type: "ARRAY",
      items: {
        type: "STRING",
        enum: ["planner", "academic", "attendance"],
      },
    },
    executionOrder: {
      type: "ARRAY",
      items: {
        type: "STRING",
        enum: ["planner", "academic", "attendance"],
      },
    },
    reasoning: {
      type: "STRING",
    },
  },
  required: ["selectedAgents", "executionOrder", "reasoning"],
};

/**
 * IppoOrchestrator — The brain of Ippo.
 *
 * Responsibilities:
 *   1. Receive prompt
 *   2. Classify intent (Gemini structured routing)
 *   3. Select agent(s)
 *   4. Execute agent(s) sequentially
 *   5. Synthesize unified response + merged execution trace
 */
export class IppoOrchestrator {
  private agents: Record<AgentType, BaseAgent>;

  constructor() {
    this.agents = {
      planner: new PlannerAgent(),
      academic: new AcademicAgent(),
      attendance: new AttendanceAgent(),
    };
  }

  /**
   * Process a user message end-to-end.
   *
   * @param message   - The user's natural-language request
   * @param studentId - The student's Firestore document ID
   * @returns Full AgentResponse with answer + execution trace
   */
  async process(
    message: string,
    studentId: string = "default"
  ): Promise<AgentResponse> {
    const tracePrefix: string[] = [];
    tracePrefix.push("Orchestrator: analyzing request");

    // Step 1 & 2: Get structured routing decision from Gemini
    let decision: RoutingDecision;
    try {
      decision = await this.determineRouting(message);
    } catch (error) {
      console.error("Routing decision failed, using fallback:", error);
      decision = {
        selectedAgents: ["academic"],
        executionOrder: ["academic"],
        reasoning: "Failed to determine route dynamically, falling back to Academic Agent.",
      };
    }

    tracePrefix.push(`Reasoning: ${decision.reasoning}`);
    tracePrefix.push(`Selected agents: ${decision.selectedAgents.join(", ")}`);
    tracePrefix.push(`Execution order: ${decision.executionOrder.join(" -> ")}`);

    if (decision.executionOrder.length === 0) {
      decision.executionOrder = ["academic"];
      tracePrefix.push("Fallback: executing Academic Agent");
    }

    const answers: string[] = [];
    const tools: string[] = [];
    let combinedTrace: string[] = [...tracePrefix];

    // Step 3 & 4: Execute agent(s) in specified order
    for (const agentKey of decision.executionOrder) {
      const agent = this.agents[agentKey];
      combinedTrace.push(`Executing agent: ${agent.name}`);
      
      const agentResponse = await agent.run(message, studentId);
      
      answers.push(`### ${agent.name} Agent Response\n${agentResponse.answer}`);
      
      // Collect tools used without duplicates
      for (const t of agentResponse.tools) {
        if (!tools.includes(t)) {
          tools.push(t);
        }
      }
      
      // Merge execution traces
      combinedTrace = [...combinedTrace, ...agentResponse.executionTrace];
    }

    // Step 5: Synthesize responses if multiple agents ran
    let finalAnswer = "";
    if (answers.length === 1) {
      // Stripping heading prefix for a single agent's response
      finalAnswer = answers[0].replace(/^### .* Agent Response\n/, "");
    } else {
      combinedTrace.push("Gemini: synthesizing multi-agent response");
      const synthesisPrompt = `You are Ippo, the Student OS. Synthesize a unified, cohesive, and helpful response for the student based on the outputs from your specialized agents.
      
Original student request: "${message}"

Agent responses:
${answers.join("\n\n")}

Provide a single, beautifully formatted markdown response that integrates these answers smoothly. Maintain all specific data points (attendance percentages, dates, free slots, assignments, etc.).`;

      finalAnswer = await generateResponse(
        synthesisPrompt,
        "You are Ippo's core synthesizer. Combine responses from specialized student agents into a single, cohesive, helpful, and concise response. Always respond in markdown."
      );
    }

    return {
      answer: finalAnswer,
      agent: decision.executionOrder.map((a) => this.agents[a].name).join(" + "),
      tools,
      executionTrace: combinedTrace,
    };
  }

  /**
   * Determine the routing decision via Gemini structured JSON output.
   */
  private async determineRouting(message: string): Promise<RoutingDecision> {
    const prompt = `You are the routing component of Ippo, the AI Student OS.
Analyze the student request: "${message}"

You must determine which specialized agent(s) need to execute, and in what order, to completely answer the user's request.
Specialized Agents:
1. planner: study scheduling, time management, finding free slots, study session plans, and timetable lookups.
2. academic: course syllabus questions, assignments, notes searches, and grades.
3. attendance: class attendance records, absence monitoring, risk alerts, attendance percentages.

Examples:
- "What is my attendance in Physics?" -> selectedAgents: ["attendance"], executionOrder: ["attendance"]
- "Do I have time to study CS on Monday?" -> selectedAgents: ["planner"], executionOrder: ["planner"]
- "My Calculus attendance is low, when can I study it?" -> selectedAgents: ["attendance", "planner"], executionOrder: ["attendance", "planner"]

Provide your reasoning and the list of agents to run.`;

    return generateStructuredResponse<RoutingDecision>(
      prompt,
      routingSchema as Record<string, unknown>,
      "You are Ippo's Agent Router. Output JSON only, matching the requested schema."
    );
  }
}
