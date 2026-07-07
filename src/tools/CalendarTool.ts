import { BaseTool, type ToolResult } from "./BaseTool";
import { DatabaseTool } from "./DatabaseTool";
import type { TimetableEntry } from "@/types";

interface FreeSlot {
  day: string;
  start: string;
  end: string;
}

interface CalendarParams {
  action: "getTimetable" | "getFreeSlots" | "checkConflicts";
  studentId: string;
  day?: string;
}

/**
 * CalendarTool — Query timetable, find free slots, detect conflicts.
 *
 * Uses DatabaseTool internally to read timetable data from Firestore.
 */
export class CalendarTool extends BaseTool {
  name = "CalendarTool";
  description = "Query timetable, find free slots, and check scheduling conflicts";

  private dbTool = new DatabaseTool();

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const { action, studentId, day } = params as unknown as CalendarParams;

    try {
      switch (action) {
        case "getTimetable": {
          const result = await this.dbTool.execute({
            operation: "readAll",
            collectionName: `students/${studentId}/timetable`,
          });
          let entries = (result.data as TimetableEntry[]) || [];
          if (day) {
            entries = entries.filter((e) => e.day === day.toLowerCase());
          }
          return { success: true, data: entries };
        }

        case "getFreeSlots": {
          const result = await this.dbTool.execute({
            operation: "readAll",
            collectionName: `students/${studentId}/timetable`,
          });
          const entries = (result.data as TimetableEntry[]) || [];
          const freeSlots = this.calculateFreeSlots(entries, day);
          return { success: true, data: freeSlots };
        }

        case "checkConflicts": {
          const result = await this.dbTool.execute({
            operation: "readAll",
            collectionName: `students/${studentId}/timetable`,
          });
          const entries = (result.data as TimetableEntry[]) || [];
          const conflicts = this.findConflicts(entries);
          return { success: true, data: conflicts };
        }

        default:
          return { success: false, data: null, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return { success: false, data: null, error: (error as Error).message };
    }
  }

  /** Find open time windows between classes (09:00–17:00 school day). */
  private calculateFreeSlots(
    entries: TimetableEntry[],
    day?: string
  ): FreeSlot[] {
    const days = day
      ? [day.toLowerCase()]
      : ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const slots: FreeSlot[] = [];
    const DAY_START = "09:00";
    const DAY_END = "17:00";

    for (const d of days) {
      const dayEntries = entries
        .filter((e) => e.day === d)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      let cursor = DAY_START;
      for (const entry of dayEntries) {
        if (cursor < entry.startTime) {
          slots.push({ day: d, start: cursor, end: entry.startTime });
        }
        if (entry.endTime > cursor) {
          cursor = entry.endTime;
        }
      }
      if (cursor < DAY_END) {
        slots.push({ day: d, start: cursor, end: DAY_END });
      }
    }

    return slots;
  }

  /** Detect overlapping entries on the same day. */
  private findConflicts(
    entries: TimetableEntry[]
  ): { a: TimetableEntry; b: TimetableEntry }[] {
    const conflicts: { a: TimetableEntry; b: TimetableEntry }[] = [];
    const sorted = [...entries].sort((a, b) =>
      a.day === b.day
        ? a.startTime.localeCompare(b.startTime)
        : a.day.localeCompare(b.day)
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = sorted[i];
      const next = sorted[i + 1];
      if (curr.day === next.day && curr.endTime > next.startTime) {
        conflicts.push({ a: curr, b: next });
      }
    }
    return conflicts;
  }
}
