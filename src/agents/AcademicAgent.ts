import { BaseAgent } from "./BaseAgent";
import type { AgentResponse } from "@/types";
import { NotesTool } from "@/tools/NotesTool";
import { DatabaseTool } from "@/tools/DatabaseTool";
import { generateResponse } from "@/lib/gemini";

/**
 * AcademicAgent — Syllabus Q&A and course-related queries.
 *
 * Pipeline:
 *   1. Search notes/syllabus via NotesTool
 *   2. Fetch course info via DatabaseTool
 *   3. Answer via Gemini with retrieved context
 */
export class AcademicAgent extends BaseAgent {
  name = "Academic";
  description = "Answers syllabus, course, and assignment questions using notes and Gemini";

  private notesTool = new NotesTool();
  private dbTool = new DatabaseTool();

  async run(message: string, studentId: string): Promise<AgentResponse> {
    this.resetTrace();
    this.addTrace("AcademicAgent activated");

    // 1. Search notes for relevant content
    this.trackTool(this.notesTool);
    this.addTrace("NotesTool: searching notes");
    const notes = await this.notesTool.execute({
      action: "searchNotes",
      studentId,
      query: message,
    });

    // 2. Fetch student's course list for context
    this.trackTool(this.dbTool);
    this.addTrace("DatabaseTool: student profile fetched");
    const student = await this.dbTool.execute({
      operation: "read",
      collectionName: "students",
      id: studentId,
    });

    // 3. Fetch tasks for assignment context
    this.addTrace("DatabaseTool: assignments fetched");
    const tasks = await this.dbTool.execute({
      operation: "readAll",
      collectionName: `students/${studentId}/tasks`,
    });

    // 4. Generate answer via Gemini with retrieved context
    this.addTrace("Gemini: answer generated");
    const prompt = `You are an academic assistant AI. Answer the student's question using the context provided.

Student question: ${message}

Student profile: ${JSON.stringify(student.data)}
Relevant notes: ${JSON.stringify(notes.data)}
Current assignments: ${JSON.stringify(tasks.data)}

Provide a helpful, accurate answer. If the notes contain relevant information, reference them. If you don't have enough context, say so honestly. Format with markdown.`;

    const answer = await generateResponse(
      prompt,
      "You are Ippo's Academic Agent. You help students with syllabus questions, assignment specs, and course content. Be accurate, helpful, and reference available notes when possible. Always respond in markdown format."
    );

    this.addTrace("Response formatted");
    return this.buildResponse(answer);
  }
}
