import { BaseTool, type ToolResult } from "./BaseTool";
import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  type WhereFilterOp,
} from "firebase/firestore";

interface QueryFilter {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

interface DatabaseParams {
  operation: "read" | "readAll" | "create" | "update" | "delete" | "query";
  collectionName: string;
  id?: string;
  data?: Record<string, unknown>;
  filters?: QueryFilter[];
}

/**
 * DatabaseTool — Firestore CRUD wrapper.
 *
 * Every agent accesses data through this tool:
 *   Agent → DatabaseTool → Firestore
 */
export class DatabaseTool extends BaseTool {
  name = "DatabaseTool";
  description =
    "CRUD operations on Firestore collections (tasks, attendance, timetable, students)";

  private static seeded = false;

  private async ensureSeeded() {
    if (DatabaseTool.seeded) return;
    try {
      const docSnap = await getDoc(doc(db, "students", "default"));
      if (!docSnap.exists()) {
        console.log("Seeding Firestore with realistic demo data...");
        await this.seedData();
      }
    } catch (err) {
      console.error("Failed to check or seed database:", err);
    }
    DatabaseTool.seeded = true;
  }

  private async seedData() {
    const studentId = "default";
    
    // 1. Student profile
    await setDoc(doc(db, "students", studentId), {
      name: "Alex Johnson",
      courses: ["MH-II", "BEE", "CS", "EW", "BME", "APC", "CH", "UHVPE"],
      semester: 2
    });

    const seedCollection = async (
      subpath: string,
      items: Array<{ id: string; [key: string]: unknown }>
    ) => {
      for (const item of items) {
        const { id, ...data } = item;
        await setDoc(doc(db, `students/${studentId}/${subpath}`, id), data);
      }
    };

    // 2. Timetable (Mapped from image, using Batch A for practicals)
    await seedCollection("timetable", [
      // Monday
      { id: "tt_mon_1", day: "monday", startTime: "10:30", endTime: "11:20", course: "MH-II (L)", room: "L-Room", type: "lecture" },
      { id: "tt_mon_2", day: "monday", startTime: "11:25", endTime: "12:15", course: "BEE (L)", room: "L-Room", type: "lecture" },
      { id: "tt_mon_3", day: "monday", startTime: "13:15", endTime: "15:00", course: "CS (P)", room: "S230", type: "lab" },
      { id: "tt_mon_4", day: "monday", startTime: "15:05", endTime: "17:00", course: "EW (P)", room: "Block-O Workshop", type: "lab" },
      // Tuesday
      { id: "tt_tue_1", day: "tuesday", startTime: "10:30", endTime: "12:15", course: "BEE (P)", room: "S332", type: "lab" },
      { id: "tt_tue_2", day: "tuesday", startTime: "13:15", endTime: "14:05", course: "BME (L)", room: "L-Room", type: "lecture" },
      { id: "tt_tue_3", day: "tuesday", startTime: "14:10", endTime: "15:00", course: "CS (L)", room: "L-Room", type: "lecture" },
      { id: "tt_tue_4", day: "tuesday", startTime: "15:05", endTime: "16:00", course: "APC (L)", room: "L-Room", type: "lecture" },
      { id: "tt_tue_5", day: "tuesday", startTime: "16:05", endTime: "17:00", course: "CH (L)", room: "L-Room", type: "lecture" },
      // Wednesday
      { id: "tt_wed_1", day: "wednesday", startTime: "10:30", endTime: "11:20", course: "Library", room: "Library", type: "lecture" },
      { id: "tt_wed_2", day: "wednesday", startTime: "11:25", endTime: "12:15", course: "MH-II (L)", room: "L-Room", type: "lecture" },
      { id: "tt_wed_3", day: "wednesday", startTime: "13:15", endTime: "14:05", course: "BEE (L)", room: "L-Room", type: "lecture" },
      { id: "tt_wed_4", day: "wednesday", startTime: "14:10", endTime: "15:00", course: "BME (L)", room: "L-Room", type: "lecture" },
      { id: "tt_wed_5", day: "wednesday", startTime: "15:05", endTime: "17:00", course: "APC (P)", room: "S122", type: "lab" },
      // Thursday
      { id: "tt_thu_1", day: "thursday", startTime: "10:30", endTime: "12:15", course: "CH (P)", room: "S109", type: "lab" },
      { id: "tt_thu_2", day: "thursday", startTime: "13:15", endTime: "14:05", course: "BME (L)", room: "L-Room", type: "lecture" },
      { id: "tt_thu_3", day: "thursday", startTime: "14:10", endTime: "15:00", course: "UHVPE (L)", room: "L-Room", type: "lecture" },
      { id: "tt_thu_4", day: "thursday", startTime: "15:05", endTime: "16:00", course: "CS (L)", room: "L-Room", type: "lecture" },
      { id: "tt_thu_5", day: "thursday", startTime: "16:05", endTime: "17:00", course: "APC (L)", room: "L-Room", type: "lecture" },
      // Friday
      { id: "tt_fri_1", day: "friday", startTime: "10:30", endTime: "12:15", course: "BME (P)", room: "S333", type: "lab" },
      { id: "tt_fri_2", day: "friday", startTime: "13:15", endTime: "14:05", course: "BEE (L)", room: "L-Room", type: "lecture" },
      { id: "tt_fri_3", day: "friday", startTime: "14:10", endTime: "15:00", course: "UHVPE (L)", room: "L-Room", type: "lecture" },
      { id: "tt_fri_4", day: "friday", startTime: "15:05", endTime: "16:00", course: "CH (L)", room: "L-Room", type: "lecture" },
      { id: "tt_fri_5", day: "friday", startTime: "16:05", endTime: "17:00", course: "MH-II (L)", room: "L-Room", type: "lecture" }
    ]);

    // 3. Attendance
    await seedCollection("attendance", [
      { id: "att_1", course: "MH-II", totalClasses: 30, attendedClasses: 27, percentage: 90, threshold: 75 },
      { id: "att_2", course: "BEE", totalClasses: 35, attendedClasses: 25, percentage: 71, threshold: 75 }, // At risk
      { id: "att_3", course: "CS", totalClasses: 40, attendedClasses: 38, percentage: 95, threshold: 75 },
      { id: "att_4", course: "EW", totalClasses: 15, attendedClasses: 14, percentage: 93, threshold: 75 },
      { id: "att_5", course: "BME", totalClasses: 30, attendedClasses: 26, percentage: 86, threshold: 75 },
      { id: "att_6", course: "APC", totalClasses: 30, attendedClasses: 20, percentage: 66, threshold: 75 }, // At risk
      { id: "att_7", course: "CH", totalClasses: 25, attendedClasses: 23, percentage: 92, threshold: 75 },
      { id: "att_8", course: "UHVPE", totalClasses: 20, attendedClasses: 18, percentage: 90, threshold: 75 }
    ]);

    // 4. Tasks
    const todayStr = new Date().toISOString().split('T')[0];
    const twoDaysLaterStr = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const fiveDaysLaterStr = new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0];

    await seedCollection("tasks", [
      { id: "task_1", title: "BEE Assignment 2", course: "BEE", dueDate: `${todayStr} 17:00`, status: "todo", priority: "high", description: "Submit numerical problems 1-5 from tutorial sheet" },
      { id: "task_2", title: "Applied Physics Lab Report", course: "APC", dueDate: `${twoDaysLaterStr} 12:00`, status: "in-progress", priority: "medium", description: "Write up findings from Optics laser experiment" },
      { id: "task_3", title: "Chemistry Tutorial Draft", course: "CH", dueDate: `${fiveDaysLaterStr} 23:59`, status: "todo", priority: "low", description: "Prepare essay on polymer structures and classifications" }
    ]);

    // 5. Notes
    await seedCollection("notes", [
      { id: "note_1", course: "CS", title: "Programming Basics", content: "Topics covered: basic structure of C programs, compilation phases, O(log N) vs O(N) complexity patterns, array data allocations." },
      { id: "note_2", course: "APC", title: "Optics & Lasers", content: "Applied Physics concepts: double slit interference, optical fibers, laser mechanisms, population inversion principles." },
      { id: "note_3", course: "MH-II", title: "Differential Equations cheat sheet", content: "Engineering Math II: first order ordinary differential equations, integrating factors, homogeneous solutions." }
    ]);
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    await this.ensureSeeded();

    const {
      operation,
      collectionName,
      id,
      data,
      filters,
    } = params as unknown as DatabaseParams;

    try {
      switch (operation) {
        case "read": {
          if (!id) throw new Error("Document ID required for read");
          const docSnap = await getDoc(doc(db, collectionName, id));
          return {
            success: true,
            data: docSnap.exists()
              ? { id: docSnap.id, ...docSnap.data() }
              : null,
          };
        }

        case "readAll": {
          const snapshot = await getDocs(collection(db, collectionName));
          const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          return { success: true, data: docs };
        }

        case "create": {
          if (!data) throw new Error("Data required for create");
          const docRef = await addDoc(collection(db, collectionName), data);
          return { success: true, data: { id: docRef.id } };
        }

        case "update": {
          if (!id || !data) throw new Error("ID and data required for update");
          await updateDoc(doc(db, collectionName, id), data);
          return { success: true, data: { id } };
        }

        case "delete": {
          if (!id) throw new Error("ID required for delete");
          await deleteDoc(doc(db, collectionName, id));
          return { success: true, data: { id } };
        }

        case "query": {
          if (!filters?.length) throw new Error("Filters required for query");
          const q = query(
            collection(db, collectionName),
            ...filters.map((f) => where(f.field, f.operator, f.value))
          );
          const snap = await getDocs(q);
          const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          return { success: true, data: results };
        }

        default:
          return {
            success: false,
            data: null,
            error: `Unknown operation: ${operation}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: (error as Error).message,
      };
    }
  }
}
