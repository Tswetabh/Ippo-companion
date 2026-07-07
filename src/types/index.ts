// ============================================================
// Ippo — Core Type Definitions
// ============================================================

/** A single message in a conversation */
export interface Message {
  role: "user" | "assistant";
  content: string;
}

/** Standard response returned by every agent through the orchestrator */
export interface AgentResponse {
  answer: string;
  agent: string;
  tools: string[];
  executionTrace: string[];
}

/** An academic task or assignment */
export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  description?: string;
}

/** Attendance record for a single course */
export interface Attendance {
  id: string;
  course: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  threshold: number; // minimum required percentage (e.g. 75)
}

/** A generated study plan containing multiple sessions */
export interface StudyPlan {
  id: string;
  studentId: string;
  sessions: StudySession[];
  generatedAt: string;
}

export interface StudySession {
  topic: string;
  course: string;
  duration: number; // minutes
  scheduledAt: string;
  type: "pomodoro" | "deep-work";
}

/** A single entry in the weekly timetable */
export interface TimetableEntry {
  id: string;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
  startTime: string; // "HH:mm"
  endTime: string;
  course: string;
  room: string;
  type: "lecture" | "lab" | "tutorial";
}

/** Complete weekly timetable for a student */
export interface Timetable {
  studentId: string;
  entries: TimetableEntry[];
}

/** Student profile */
export interface Student {
  id: string;
  name: string;
  courses: string[];
  semester: number;
}
