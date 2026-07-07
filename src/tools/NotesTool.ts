import { BaseTool, type ToolResult } from "./BaseTool";
import { DatabaseTool } from "./DatabaseTool";

interface NotesParams {
  action: "getNotes" | "searchNotes" | "getSyllabus";
  studentId: string;
  course?: string;
  query?: string;
}

/**
 * NotesTool — Fetch and search course notes and syllabus content.
 *
 * Uses DatabaseTool internally for all Firestore access.
 */
export class NotesTool extends BaseTool {
  name = "NotesTool";
  description = "Fetch and search course notes and syllabus content";

  private dbTool = new DatabaseTool();

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const { action, studentId, course, query: searchQuery } = params as unknown as NotesParams;

    try {
      switch (action) {
        case "getNotes": {
          const result = await this.dbTool.execute({
            operation: "readAll",
            collectionName: `students/${studentId}/notes`,
          });
          let notes = (result.data as Record<string, unknown>[]) || [];
          if (course) {
            notes = notes.filter((n) => n.course === course);
          }
          return { success: true, data: notes };
        }

        case "searchNotes": {
          const result = await this.dbTool.execute({
            operation: "readAll",
            collectionName: `students/${studentId}/notes`,
          });
          const notes = (result.data as Record<string, unknown>[]) || [];
          const filtered = searchQuery
            ? notes.filter((n) =>
                JSON.stringify(n).toLowerCase().includes(searchQuery.toLowerCase())
              )
            : notes;
          return { success: true, data: filtered };
        }

        case "getSyllabus": {
          if (!course) {
            return { success: false, data: null, error: "Course required for getSyllabus" };
          }
          const result = await this.dbTool.execute({
            operation: "query",
            collectionName: `students/${studentId}/syllabus`,
            filters: [{ field: "course", operator: "==", value: course }],
          });
          return { success: true, data: result.data };
        }

        default:
          return { success: false, data: null, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return { success: false, data: null, error: (error as Error).message };
    }
  }
}
