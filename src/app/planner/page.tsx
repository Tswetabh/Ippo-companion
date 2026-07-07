"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { db } from "@/firebase/config";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import type { Task } from "@/types";

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<string | null>(null);

  // New Task Dialog State
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCourse, setNewTaskCourse] = useState("Calculus II");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const studentId = "default";

  const fetchTasks = async () => {
    try {
      const snap = await getDocs(collection(db, `students/${studentId}/tasks`));
      const tasksData = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Task[];
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const taskRef = doc(db, `students/${studentId}/tasks`, taskId);
      await updateDoc(taskRef, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const newTask = {
        title: newTaskTitle,
        course: newTaskCourse,
        dueDate: `${todayStr} 23:59`,
        status: "todo" as const,
        priority: newTaskPriority,
        description: newTaskDesc,
      };

      await addDoc(collection(db, `students/${studentId}/tasks`), newTask);
      setShowNewTaskModal(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptimizeSchedule = async () => {
    setOptimizing(true);
    setOptimizationResult(null);
    try {
      const response = await fetch("/api/ippo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Optimize my schedule and suggest how to balance my pending assignments.",
          studentId,
        }),
      });
      const data = await response.json();
      setOptimizationResult(data.answer);
    } catch (error) {
      console.error(error);
      setOptimizationResult("Failed to optimize schedule. Please check Gemini API key.");
    } finally {
      setOptimizing(false);
    }
  };

  const columns: { label: string; status: Task["status"]; color: string }[] = [
    { label: "To Do", status: "todo", color: "bg-outline" },
    { label: "In Progress", status: "in-progress", color: "bg-primary" },
    { label: "Under Review", status: "review", color: "bg-secondary" },
    { label: "Completed", status: "completed", color: "bg-tertiary" },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium">Loading Tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isFocusMode ? "opacity-90 transition-opacity bg-surface-container-highest min-h-screen" : ""}>
      <Header />
      
      <main className={`flex-1 p-4 md:p-gutter lg:p-margin-desktop overflow-x-hidden ${isFocusMode ? "max-w-4xl mx-auto" : ""}`}>
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-background mb-1" style={{ fontSize: "2rem", lineHeight: "2.5rem" }}>
              Assignments & Tasks
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage your workload across all courses.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Focus Mode Toggle */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant/30">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Focus Mode</span>
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  isFocusMode ? "bg-primary" : "bg-outline-variant"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isFocusMode ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-3 py-1.5 bg-primary text-on-primary text-label-sm font-label-sm font-medium rounded hover:bg-surface-tint transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Add Task
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
          {/* Kanban Board */}
          <div className="xl:col-span-9 overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-6 min-w-max">
              {columns.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.status);
                return (
                  <div key={col.status} className="w-80 flex flex-col gap-4 bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/30 kanban-col-min-h">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                        <h3 className="font-title-md text-title-md text-on-background" style={{ fontSize: "14px" }}>{col.label}</h3>
                        <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-[10px]">
                          {colTasks.length}
                        </span>
                      </div>
                    </div>

                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}
                      >
                        {task.priority === "high" && col.status !== "completed" && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
                        )}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-1 rounded font-label-sm text-[10px] uppercase tracking-wider font-semibold ${
                            task.course.includes("CS") ? "bg-secondary-container/20 text-secondary-container" :
                            task.course.includes("Phys") ? "bg-primary-container/20 text-primary" : "bg-tertiary-container/20 text-tertiary"
                          }`}>
                            {task.course}
                          </span>
                          
                          {/* Task Action Controls */}
                          <div className="flex gap-1">
                            {col.status !== "todo" && (
                              <button
                                onClick={() => {
                                  const prevStatuses: Record<string, Task["status"]> = {
                                    "in-progress": "todo",
                                    "review": "in-progress",
                                    "completed": "review",
                                  };
                                  handleUpdateStatus(task.id, prevStatuses[col.status]);
                                }}
                                className="text-outline hover:text-primary p-0.5"
                                title="Move Left"
                              >
                                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                              </button>
                            )}
                            {col.status !== "completed" && (
                              <button
                                onClick={() => {
                                  const nextStatuses: Record<string, Task["status"]> = {
                                    "todo": "in-progress",
                                    "in-progress": "review",
                                    "review": "completed",
                                  };
                                  handleUpdateStatus(task.id, nextStatuses[col.status]);
                                }}
                                className="text-outline hover:text-primary p-0.5"
                                title="Move Right"
                              >
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className={`font-body-lg text-body-lg text-on-background font-medium mb-2 leading-tight ${
                          col.status === "completed" ? "line-through text-on-surface-variant decoration-outline-variant" : ""
                        }`}>
                          {task.title}
                        </h4>
                        
                        {task.description && (
                          <p className="font-body-md text-label-sm text-on-surface-variant mb-4 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                          <div className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>calendar_today</span>
                            <span className="font-label-sm text-[11px]">{task.dueDate.split(" ")[0]}</span>
                          </div>
                          {task.priority === "high" && col.status !== "completed" && (
                            <span className="text-error font-semibold text-[10px] uppercase">Urgent</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="text-center py-8 text-on-surface-variant/30 border border-dashed border-outline-variant/30 rounded-xl">
                        <span className="material-symbols-outlined text-[32px] block mb-1">inbox</span>
                        <span className="text-xs">No tasks</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar: Deadlines & AI Insights */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            {/* Upcoming Deadlines */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h3 className="font-title-md text-title-md text-on-background font-semibold mb-4">Milestones</h3>
              <div className="relative pl-4 border-l-2 border-surface-container-highest flex flex-col gap-5">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface-container-lowest"></div>
                  <p className="font-label-sm text-[10px] text-error font-semibold mb-0.5 uppercase tracking-wide">Calculus PS4</p>
                  <p className="font-body-md text-body-md font-medium text-on-background leading-tight">Calculus Homework</p>
                  <p className="font-label-sm text-on-surface-variant mt-1 text-[11px]">Due Today</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface-container-lowest"></div>
                  <p className="font-label-sm text-[10px] text-primary font-semibold mb-0.5 uppercase tracking-wide">Physics Lab Report</p>
                  <p className="font-body-md text-body-md font-medium text-on-background leading-tight">Kinematics findings</p>
                  <p className="font-label-sm text-on-surface-variant mt-1 text-[11px]">Due in 2 days</p>
                </div>
              </div>
            </div>

            {/* AI Agent Optimizer Card */}
            <div className="bg-gradient-to-br from-surface-container-lowest to-secondary-fixed/30 rounded-2xl border border-secondary-fixed-dim/50 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
                <h3 className="font-title-md text-[14px] text-secondary font-semibold">AI Planner Assistant</h3>
              </div>
              <p className="font-body-md text-body-md text-on-background mb-4 relative z-10 text-[13px] leading-relaxed">
                You have a heavy workload clustering around this week. I can automatically optimize your study sessions using your timetable and free slots.
              </p>
              
              <button
                onClick={handleOptimizeSchedule}
                disabled={optimizing}
                className="w-full py-2 bg-secondary-container/20 text-secondary border border-secondary/20 rounded-lg font-label-sm font-medium hover:bg-secondary-container/40 transition-colors relative z-10 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {optimizing ? "sync" : "auto_awesome"}
                </span>
                {optimizing ? "Optimizing..." : "Optimize Schedule"}
              </button>

              {optimizationResult && (
                <div className="mt-4 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl relative z-10 max-h-48 overflow-y-auto text-xs text-on-surface-variant">
                  <h4 className="font-bold text-secondary mb-1">Optimized Recommendation:</h4>
                  <p className="whitespace-pre-line">{optimizationResult}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant max-w-md w-full shadow-lg">
            <h3 className="font-title-md text-title-md text-on-background mb-4">Create New Assignment</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. CS Project Phase 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Course</label>
                  <select
                    value={newTaskCourse}
                    onChange={(e) => setNewTaskCourse(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Calculus II</option>
                    <option>Physics 101</option>
                    <option>Introduction to CS</option>
                    <option>History 105</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Description</label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-20"
                  placeholder="Details about homework specifications..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 border border-outline rounded-lg text-label-sm font-label-sm hover:bg-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-sm font-label-sm hover:bg-surface-tint transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
