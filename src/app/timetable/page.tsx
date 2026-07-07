"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { db } from "@/firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import type { TimetableEntry } from "@/types";

export default function Timetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Booking State
  const [focusTopic, setFocusTopic] = useState("Introduction to CS");
  const [duration, setDuration] = useState("60m");
  const [intensity, setIntensity] = useState("Deep Work");
  const [bookingDay, setBookingDay] = useState("tuesday");
  const [bookingTime, setBookingTime] = useState("13:00");

  const studentId = "default";

  const fetchTimetable = async () => {
    try {
      const snap = await getDocs(
        collection(db, `students/${studentId}/timetable`)
      );
      const timetableData = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as TimetableEntry[];
      setEntries(timetableData);
    } catch (err) {
      console.error("Error loading timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate end time based on duration
    const [h, m] = bookingTime.split(":").map(Number);
    const durationMins = parseInt(duration);
    const endMinutesTotal = h * 60 + m + durationMins;
    const endH = Math.floor(endMinutesTotal / 60);
    const endM = endMinutesTotal % 60;
    const endTimeStr = `${endH.toString().padStart(2, "0")}:${endM
      .toString()
      .padStart(2, "0")}`;

    const newSession = {
      day: bookingDay.toLowerCase(),
      startTime: bookingTime,
      endTime: endTimeStr,
      course: focusTopic,
      room: intensity,
      type: "lecture" as const, // Rendered like normal events
    };

    try {
      await addDoc(collection(db, `students/${studentId}/timetable`), newSession);
      fetchTimetable();
      alert(`Successfully booked a ${duration} ${intensity} session!`);
    } catch (error) {
      console.error("Failed to book session:", error);
    }
  };

  // Convert time "09:00" to height offset
  const getEventPosition = (startTime: string, endTime: string) => {
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h + m / 60;
    };
    const startHour = parseTime(startTime);
    const endHour = parseTime(endTime);

    // Grid starts at 09:00, each hour is 80px (h-20)
    const top = (startHour - 9) * 80;
    const height = (endHour - startHour) * 80;
    return { top: `${top}px`, height: `${height}px` };
  };

  const days: { key: string; label: string; num: number }[] = [
    { key: "monday", label: "Mon", num: 12 },
    { key: "tuesday", label: "Tue", num: 13 },
    { key: "wednesday", label: "Wed", num: 14 },
    { key: "thursday", label: "Thu", num: 15 },
    { key: "friday", label: "Fri", num: 16 },
  ];

  const timeLabels = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium">Loading Timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex-1 p-4 md:p-margin-desktop overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-gutter h-auto lg:h-[calc(100vh-8rem)]">
          {/* Timetable Main View */}
          <div className="flex-1 lg:w-7/12 flex flex-col gap-4 min-h-[500px]">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background tracking-tight">
                Weekly Schedule
              </h2>
              <span className="font-label-sm text-label-sm bg-surface-container px-3 py-1.5 rounded border border-outline-variant font-medium">
                Week View
              </span>
            </div>

            <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col relative">
              {/* Header Row */}
              <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] border-b border-outline-variant bg-surface-container-low/50 sticky top-0 z-10">
                <div className="p-3 text-center border-r border-outline-variant/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-[18px]">access_time</span>
                </div>
                {days.map((day) => (
                  <div key={day.key} className="p-3 text-center border-r border-outline-variant/30">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                      {day.label}
                    </span>
                    <span className="font-title-md text-title-md text-on-background">{day.num}</span>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-surface-container-lowest min-h-[660px]">
                {/* Background Grid Columns */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr]">
                  <div className="border-r border-outline-variant/20"></div>
                  {days.map((day) => (
                    <div key={day.key} className="border-r border-outline-variant/20"></div>
                  ))}
                </div>

                <div className="relative h-[680px]">
                  {/* Time Labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-[60px] flex flex-col font-label-sm text-label-sm text-outline">
                    {timeLabels.map((time) => (
                      <div key={time} className="h-20 border-b border-outline-variant/20 flex items-start justify-center pt-2">
                        {time}
                      </div>
                    ))}
                    <div className="h-20 flex items-start justify-center pt-2">17:00</div>
                  </div>

                  {/* Horizontal Grid Lines */}
                  <div className="absolute left-[60px] right-0 top-0 bottom-0 pointer-events-none">
                    {timeLabels.map((time) => (
                      <div key={time} className="h-20 border-b border-outline-variant/20"></div>
                    ))}
                  </div>

                  {/* Events Container */}
                  <div className="absolute left-[60px] right-0 top-0 bottom-0 grid grid-cols-5 p-1 gap-1">
                    {days.map((day) => {
                      const dayEvents = entries.filter((e) => e.day === day.key);
                      return (
                        <div key={day.key} className="relative h-full">
                          {dayEvents.map((event) => {
                            const pos = getEventPosition(event.startTime, event.endTime);
                            const isCustomDW = event.room.includes("Work") || event.room.includes("Pomo");
                            return (
                              <div
                                key={event.id}
                                className="absolute w-full p-1"
                                style={{ top: pos.top, height: pos.height }}
                              >
                                <div className={`w-full h-full rounded-md p-2 flex flex-col hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden ${
                                  isCustomDW 
                                    ? "bg-surface-variant/40 border border-outline-variant border-dashed text-center justify-center items-center"
                                    : event.course.includes("CS") ? "bg-secondary-container/20 border border-secondary/30"
                                    : event.course.includes("Phys") ? "bg-tertiary-container/20 border border-tertiary/30"
                                    : "bg-primary-container/20 border border-primary/30"
                                }`}>
                                  {!isCustomDW && (
                                    <div className={`w-1 h-full absolute left-0 top-0 rounded-l-md opacity-70 group-hover:opacity-100 transition-opacity ${
                                      event.course.includes("CS") ? "bg-secondary" : event.course.includes("Phys") ? "bg-tertiary" : "bg-primary"
                                    }`}></div>
                                  )}
                                  
                                  {isCustomDW ? (
                                    <>
                                      <span className="material-symbols-outlined text-outline mb-1">timer</span>
                                      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{event.course}</span>
                                      <span className="font-label-sm text-label-sm text-outline text-[10px]">{event.room}</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className={`font-label-sm text-label-sm font-semibold ${
                                        event.course.includes("CS") ? "text-secondary" : event.course.includes("Phys") ? "text-tertiary" : "text-primary"
                                      }`}>
                                        {event.course.split(":")[0]}
                                      </span>
                                      <span className="font-body-md text-body-md text-on-surface text-xs truncate leading-tight font-medium">
                                        {event.course.split(":")[1] || event.course}
                                      </span>
                                      <span className="font-label-sm text-label-sm text-outline mt-auto flex items-center gap-1 text-[10px]">
                                        <span className="material-symbols-outlined text-[12px]">location_on</span> {event.room}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Bookings & Analytics */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            {/* Session Booking Form */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-background flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">psychology</span>
                      Book Study Session
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Schedule your next focus block</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></div>
                </div>

                <form onSubmit={handleBookSession} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">Topic</label>
                      <select
                        value={focusTopic}
                        onChange={(e) => setFocusTopic(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
                      >
                        <option>Introduction to CS</option>
                        <option>Physics 101</option>
                        <option>Calculus II</option>
                        <option>History 105</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">Day</label>
                      <select
                        value={bookingDay}
                        onChange={(e) => setBookingDay(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
                      >
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">Start Time</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
                      >
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
                      >
                        <option value="60m">60 mins</option>
                        <option value="90m">90 mins</option>
                        <option value="120m">120 mins</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">Intensity</label>
                    <select
                      value={intensity}
                      onChange={(e) => setIntensity(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
                    >
                      <option>Deep Work</option>
                      <option>Pomodoro</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-on-background text-surface-container-lowest font-title-md text-title-md py-2.5 rounded-lg hover:bg-on-background/90 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">bolt</span>
                    Book Session
                  </button>
                </form>
              </div>
            </div>

            {/* Analytics Bento Grid */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Time on Task</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">timelapse</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-display-lg text-on-background">14</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">hrs</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    +2.4 hrs this week
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Syllabus</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">donut_large</span>
                </div>
                <div className="flex-1 flex items-center justify-center relative my-2">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-surface-variant" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-tertiary-fixed-dim" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-title-md text-title-md text-on-background">75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
