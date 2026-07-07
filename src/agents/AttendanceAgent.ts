import { BaseAgent } from "./BaseAgent";
import type { AgentResponse, Attendance } from "@/types";
import { DatabaseTool } from "@/tools/DatabaseTool";
import { generateResponse } from "@/lib/gemini";

/**
 * AttendanceAgent — Tracks attendance and surfaces risk alerts.
 *
 * Pipeline:
 *   1. Fetch attendance records via DatabaseTool
 *   2. Calculate risk levels locally
 *   3. Generate human-readable summary via Gemini
 */
export class AttendanceAgent extends BaseAgent {
  name = "Attendance";
  description = "Tracks attendance records and alerts on risk of falling below thresholds";

  private dbTool = new DatabaseTool();

  async run(message: string, studentId: string): Promise<AgentResponse> {
    this.resetTrace();
    this.addTrace("AttendanceAgent activated");

    // 1. Fetch all attendance records
    this.trackTool(this.dbTool);
    this.addTrace("DatabaseTool: attendance records fetched");
    const result = await this.dbTool.execute({
      operation: "readAll",
      collectionName: `students/${studentId}/attendance`,
    });

    const records = (result.data as Attendance[]) || [];

    // 2. Calculate risk analysis locally
    this.addTrace("Risk analysis computed");
    const analysis = this.analyseAttendance(records);

    // 3. Generate human-readable response via Gemini
    this.addTrace("Gemini: summary generated");
    const prompt = `You are an attendance monitoring AI. Based on the following data, respond to the student's question.

Student question: ${message}

Attendance records: ${JSON.stringify(records)}

Risk analysis:
- At-risk courses (below threshold): ${JSON.stringify(analysis.atRisk)}
- Safe courses: ${JSON.stringify(analysis.safe)}
- Overall attendance: ${analysis.overallPercentage.toFixed(1)}%

Provide a clear, actionable summary. Highlight any courses at risk and suggest how many classes the student must attend to recover. Format with markdown.`;

    const answer = await generateResponse(
      prompt,
      "You are Ippo's Attendance Agent. You monitor class attendance and warn students about risks. Be direct, highlight danger clearly, and give specific recovery advice. Always respond in markdown format."
    );

    this.addTrace("Response formatted");
    return this.buildResponse(answer);
  }

  /** Local risk computation — no LLM call needed for math. */
  private analyseAttendance(records: Attendance[]) {
    const atRisk: Attendance[] = [];
    const safe: Attendance[] = [];
    let totalAttended = 0;
    let totalClasses = 0;

    for (const record of records) {
      totalAttended += record.attendedClasses;
      totalClasses += record.totalClasses;

      if (record.percentage < record.threshold) {
        atRisk.push(record);
      } else {
        safe.push(record);
      }
    }

    return {
      atRisk,
      safe,
      overallPercentage: totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0,
    };
  }
}
