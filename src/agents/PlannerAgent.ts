import { BaseAgent } from "./BaseAgent";
import type { AgentResponse } from "@/types";
import { CalendarTool } from "@/tools/CalendarTool";
import { DatabaseTool } from "@/tools/DatabaseTool";
import { generateResponse } from "@/lib/gemini";

/**
 * PlannerAgent — Generates optimised study plans.
 *
 * Pipeline:
 *   1. Fetch timetable via CalendarTool
 *   2. Find free slots via CalendarTool
 *   3. Fetch pending tasks via DatabaseTool
 *   4. Generate study plan via Gemini
 */
export class PlannerAgent extends BaseAgent {
  name = "Planner";
  description = "Generates study plans by analysing timetable and assignments";

  private calendarTool = new CalendarTool();
  private dbTool = new DatabaseTool();

  async run(message: string, studentId: string): Promise<AgentResponse> {
    this.resetTrace();
    this.addTrace("PlannerAgent activated");

    // 1. Fetch timetable
    this.trackTool(this.calendarTool);
    this.addTrace("CalendarTool: timetable queried");
    const timetable = await this.calendarTool.execute({
      action: "getTimetable",
      studentId,
    });

    // 2. Find free slots
    this.addTrace("CalendarTool: free slots calculated");
    const freeSlots = await this.calendarTool.execute({
      action: "getFreeSlots",
      studentId,
    });

    // 3. Fetch pending tasks
    this.trackTool(this.dbTool);
    this.addTrace("DatabaseTool: assignments fetched");
    const tasks = await this.dbTool.execute({
      operation: "readAll",
      collectionName: `students/${studentId}/tasks`,
    });

    // 4. Generate study plan via Gemini
    this.addTrace("Gemini: study plan generated");
    const prompt = `You are a student planner AI. Based on the following data, create an optimised study plan.

User request: ${message}

Current timetable: ${JSON.stringify(timetable.data)}
Free time slots: ${JSON.stringify(freeSlots.data)}
Pending tasks: ${JSON.stringify(tasks.data)}

Respond with a clear, actionable study plan. Include specific time slots, topics, and durations. Be concise and practical. Format with markdown.`;

    const answer = await generateResponse(
      prompt,
      "You are Ippo's Planner Agent. You create optimised study schedules for students. Be concise, specific, and actionable. Always respond in markdown format."
    );

    this.addTrace("Response formatted");
    return this.buildResponse(answer);
  }
}
