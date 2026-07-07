"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { db } from "@/firebase/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { Student, Attendance, Task, TimetableEntry } from "@/types";

export default function Dashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const studentId = "default";
        
        // Fetch student profile
        const studentSnap = await getDoc(doc(db, "students", studentId));
        if (studentSnap.exists()) {
          setStudent({ id: studentSnap.id, ...studentSnap.data() } as Student);
        }

        // Fetch attendance
        const attendanceSnap = await getDocs(
          collection(db, `students/${studentId}/attendance`)
        );
        const attendanceData = attendanceSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Attendance[];
        setAttendance(attendanceData);

        // Fetch tasks
        const tasksSnap = await getDocs(
          collection(db, `students/${studentId}/tasks`)
        );
        const tasksData = tasksSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Task[];
        setTasks(tasksData);

        // Fetch timetable
        const timetableSnap = await getDocs(
          collection(db, `students/${studentId}/timetable`)
        );
        const timetableData = timetableSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as TimetableEntry[];
        setTimetable(timetableData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Pomodoro Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper computations
  const getTodayDayName = () => {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return dayNames[new Date().getDay()];
  };

  const todayDay = getTodayDayName();
  // Filter timetable for today (fallback to Monday for demo if weekend)
  const isWeekend = todayDay === "saturday" || todayDay === "sunday";
  const activeDay = isWeekend ? "monday" : todayDay;

  const todayClasses = timetable.filter(
    (entry) => entry.day === activeDay
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const urgentTasksCount = pendingTasks.filter((t) => t.priority === "high").length;

  // Calculate overall attendance
  const totalClasses = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallAttendancePercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  // Find next class today
  const getNextClass = () => {
    if (todayClasses.length === 0) return "No more classes today";
    const nowTimeStr = new Date().toTimeString().slice(0, 5); // "HH:MM"
    const next = todayClasses.find((e) => e.startTime > nowTimeStr);
    return next ? `${next.course} at ${next.startTime}` : "Finished for the day";
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 p-margin-mobile md:p-gutter max-w-max-width mx-auto w-full">
        {/* Hero Section */}
        <section className="mb-8 space-y-6">
          <div className="bg-gradient-to-r from-primary-container/20 to-secondary-container/20 rounded-2xl p-6 md:p-8 card-shadow border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/30 relative">
                <span className="material-symbols-outlined text-secondary filled-icon">smart_toy</span>
                <div className="absolute top-0 right-0 w-3 h-3 bg-tertiary rounded-full border-2 border-surface animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary-fixed mb-2">
                  Good morning, {student?.name || "Student"}.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                  Your day at a glance: You have <strong>{todayClasses.length} classes</strong> scheduled for {activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}, and{" "}
                  <strong>{pendingTasks.length} pending assignments</strong> to complete. Keep up the good work!
                </p>
              </div>
            </div>
          </div>

          {/* Hero Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 card-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Today's Classes</p>
                <p className="font-title-md text-title-md">{todayClasses.length} Sessions</p>
                <p className="font-label-sm text-label-sm text-tertiary mt-1">Next: {getNextClass()}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 card-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-error">
                <span className="material-symbols-outlined">assignment_late</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pending Assignments</p>
                <p className="font-title-md text-title-md">{pendingTasks.length} Tasks</p>
                <p className="font-label-sm text-label-sm text-error mt-1">{urgentTasksCount} High Priority</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 card-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">event_note</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Term</p>
                <p className="font-title-md text-title-md">Semester {student?.semester || 1}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">4 core courses registered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Radial */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 card-shadow flex flex-col">
            <h3 className="font-title-md text-title-md mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">fact_check</span>
              Attendance
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-32 h-32 rounded-full border-[8px] border-surface-container flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-primary"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * overallAttendancePercentage) / 100}
                  ></circle>
                </svg>
                <div className="text-center">
                  <span className="font-display-lg text-display-lg text-on-surface block leading-none" style={{ fontSize: "36px" }}>
                    {overallAttendancePercentage}%
                  </span>
                  <span className={`font-label-sm text-label-sm ${overallAttendancePercentage >= 75 ? "text-tertiary" : "text-error"}`}>
                    {overallAttendancePercentage >= 75 ? "On Track" : "At Risk"}
                  </span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-6 text-center">
                You've attended {totalAttended} of {totalClasses} classes this semester.
              </p>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 card-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-title-md text-title-md flex items-center gap-2">
                <span className="material-symbols-outlined text-error">notification_important</span>
                Deadlines
              </h3>
              <button className="text-primary hover:bg-surface-container p-1 rounded transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div className="space-y-4">
              {pendingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className={`flex gap-3 items-start p-3 rounded-xl border transition-all ${
                    task.priority === "high"
                      ? "bg-error-container/20 border-error-container"
                      : "hover:bg-surface-container border-transparent"
                  }`}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full ${task.priority === "high" ? "bg-error" : "bg-primary"}`}></div>
                  <div className="flex-1">
                    <p className="font-body-md text-body-md font-medium">{task.title}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {task.course} • Due {task.dueDate}
                    </p>
                  </div>
                  {task.priority === "high" && (
                    <span className="px-2 py-1 bg-error text-on-error rounded text-[10px] font-bold uppercase tracking-wider">
                      Urgent
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule Timeline */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 card-shadow lg:row-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-md text-title-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Today's Timeline
              </h3>
              <span className="font-label-sm text-label-sm bg-surface-container px-2 py-1 rounded">
                {activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}
              </span>
            </div>
            <div className="relative border-l-2 border-outline-variant/30 ml-3 space-y-6 flex-1">
              {todayClasses.map((entry) => (
                <div key={entry.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                  <p className="font-label-sm text-label-sm text-primary font-bold">
                    {entry.startTime} - {entry.endTime}
                  </p>
                  <div className="mt-1 bg-primary-container/10 border border-primary/30 rounded-lg p-3">
                    <p className="font-body-md text-body-md font-bold text-primary">{entry.course}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> {entry.room}
                    </p>
                  </div>
                </div>
              ))}
              {todayClasses.length === 0 && (
                <p className="text-on-surface-variant italic p-4 text-center">No lectures scheduled for today.</p>
              )}
            </div>
          </div>

          {/* Study Progress focus */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 card-shadow lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-title-md text-title-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">insights</span>
                  Study Focus
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Hours spent in deep work this week</p>
              </div>
              <select className="bg-surface-container text-body-md rounded-lg border-none py-1 pl-3 pr-8 focus:ring-0 cursor-pointer">
                <option>This Week</option>
              </select>
            </div>
            <div className="h-48 flex items-end gap-2 relative">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-on-surface-variant">
                <span>6h</span>
                <span>4h</span>
                <span>2h</span>
                <span>0h</span>
              </div>
              <div className="flex-1 h-full ml-6 border-b border-outline-variant/30 flex items-end justify-around pb-1 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-outline-variant/10 w-full"></div>
                  <div className="border-t border-outline-variant/10 w-full"></div>
                  <div className="border-t border-outline-variant/10 w-full"></div>
                  <div className="border-t border-transparent w-full"></div>
                </div>
                {/* Simulated Focus chart bars */}
                <div className="w-8 md:w-12 bg-primary/20 rounded-t-sm h-[40%] relative group cursor-pointer hover:bg-primary/40 transition-colors">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">2.5 hrs</div>
                </div>
                <div className="w-8 md:w-12 bg-primary/20 rounded-t-sm h-[60%] relative group cursor-pointer hover:bg-primary/40 transition-colors">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">3.8 hrs</div>
                </div>
                <div className="w-8 md:w-12 bg-primary/60 rounded-t-sm h-[80%] relative group cursor-pointer hover:bg-primary/80 transition-colors">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">4.5 hrs</div>
                </div>
                <div className="w-8 md:w-12 bg-primary rounded-t-sm h-[90%] relative group cursor-pointer border-t-2 border-on-primary-fixed">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">5.2 hrs</div>
                </div>
                <div className="w-8 md:w-12 bg-surface-container rounded-t-sm h-[10%] relative group cursor-pointer"></div>
                <div className="w-8 md:w-12 bg-surface-container rounded-t-sm h-[10%] relative group cursor-pointer"></div>
                <div className="w-8 md:w-12 bg-surface-container rounded-t-sm h-[10%] relative group cursor-pointer"></div>
              </div>
            </div>
            <div className="flex justify-around ml-6 mt-2 text-[10px] text-on-surface-variant uppercase font-medium">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span className="text-primary font-bold">Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Agent Insight */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 card-shadow">
            <h3 className="font-title-md text-title-md mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">wb_twilight</span>
              Agent Insight
            </h3>
            <div className="bg-secondary-container/10 rounded-xl p-4 border border-secondary-container/20">
              <p className="font-body-md text-body-md italic text-on-surface">
                "Based on your attendance and study patterns, your Calculus attendance is currently at 70%, which is below the 75% threshold. Consider rescheduling study focus time for Calculus today."
              </p>
              <div className="mt-4 flex gap-2">
                <button className="text-label-sm font-label-sm bg-secondary text-on-secondary px-3 py-1.5 rounded-lg hover:bg-on-secondary-fixed transition-colors">
                  Apply to Planner
                </button>
              </div>
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 card-shadow flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="font-title-md text-title-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">timer</span>
                Focus Timer
              </h3>
              <span className="font-label-sm text-label-sm bg-surface-container px-2 py-1 rounded">Pomodoro</span>
            </div>
            <div className="my-6 relative flex items-center justify-center w-36 h-36">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-surface-variant" cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeWidth="2"></circle>
                <circle
                  className="text-primary transition-all duration-1000"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * timerSeconds) / (25 * 60)}
                ></circle>
              </svg>
              <div className="text-center">
                <span className="font-display-lg text-display-lg font-mono text-on-surface block leading-none tracking-tight" style={{ fontSize: "32px" }}>
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(25 * 60);
                }}
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined">restart_alt</span>
              </button>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary-container transition-colors text-on-primary shadow-md"
              >
                <span className="material-symbols-outlined filled-icon">
                  {timerRunning ? "pause" : "play_arrow"}
                </span>
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(5 * 60); // short break
                }}
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined">skip_next</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 card-shadow lg:col-span-2">
            <h3 className="font-title-md text-title-md mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-center p-3 hover:bg-surface-container rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">grade</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md">
                    Grade posted: <span className="font-bold">A-</span> for Midterm Essay
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">History 105 • 2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-3 hover:bg-surface-container rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md">Task completed: Read pages 40-65</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Intro to CS • Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
