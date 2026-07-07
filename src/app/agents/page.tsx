"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  trace?: string[];
}

export default function Agents() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am Ippo, your Student OS. I orchestrate specialised academic agents to assist you. Ask me about your study plan, notes, syllabus, or attendance records!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTrace, setCurrentTrace] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setCurrentTrace(["Orchestrator: analyzing request..."]);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("/api/ippo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, studentId: "default" }),
      });

      const data = await response.json();

      if (response.ok) {
        // Animate the trace loading
        let currentStepIndex = 0;
        const fullTrace = data.executionTrace || [];

        const interval = setInterval(() => {
          if (currentStepIndex < fullTrace.length) {
            setCurrentTrace(fullTrace.slice(0, currentStepIndex + 1));
            currentStepIndex++;
          } else {
            clearInterval(interval);
            // Append assistant response after trace finished rendering
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: data.answer,
                agent: data.agent,
                trace: data.executionTrace,
              },
            ]);
            setLoading(false);
          }
        }, 600); // progressive loading animation for trace steps
      } else {
        throw new Error(data.error || "Failed to contact Ippo");
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error communicating with the agent. Please verify your Gemini and Firebase environment variables are set.",
        },
      ]);
      setLoading(false);
      setCurrentTrace([]);
    }
  };

  return (
    <>
      <Header />
      <div className="p-margin-desktop pt-8 w-full max-w-max-width mx-auto flex-1 flex flex-col lg:flex-row gap-gutter">
        {/* Left Pane: Agents Panel Grid */}
        <div className={`flex-1 transition-all duration-300 ${showChat ? "lg:max-w-[55%]" : "w-full"}`}>
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">AI Agents Panel</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Manage and monitor your dedicated academic assistants.</p>
            </div>
            {!showChat && (
              <button
                onClick={() => setShowChat(true)}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-surface-tint transition-all flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span> Chat with Ippo
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Planner Agent */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-tertiary-container">
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>smart_toy</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary pulse-green"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Active</span>
                </div>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-1 relative z-10">Planner Agent</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 relative z-10 h-10">Optimising your week and rescheduling conflicts.</p>
              <div className="w-full h-12 mb-6 border-b border-outline-variant/30 flex items-end justify-between px-1 relative z-10">
                <div className="w-[14%] bg-tertiary/20 rounded-t-sm" style={{ height: "40%" }}></div>
                <div className="w-[14%] bg-tertiary/40 rounded-t-sm" style={{ height: "60%" }}></div>
                <div className="w-[14%] bg-tertiary/30 rounded-t-sm" style={{ height: "50%" }}></div>
                <div className="w-[14%] bg-tertiary/60 rounded-t-sm" style={{ height: "80%" }}></div>
                <div className="w-[14%] bg-tertiary/80 rounded-t-sm" style={{ height: "70%" }}></div>
                <div className="w-[14%] bg-tertiary rounded-t-sm" style={{ height: "90%" }}></div>
              </div>
              <button
                onClick={() => {
                  setShowChat(true);
                  setInput("Create a study plan for this week.");
                }}
                className="w-full bg-surface-container text-on-surface py-2 rounded-lg font-label-sm text-label-sm hover:bg-surface-variant transition-colors"
              >
                Invoke Planner
              </button>
            </div>

            {/* Academic Agent */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>school</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Ready</span>
                </div>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-1 relative z-10">Academic Agent</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 relative z-10 h-10">Ask me about your syllabus or assignment specs.</p>
              <div className="w-full h-12 mb-6 border-b border-outline-variant/30 flex items-end justify-between px-1 relative z-10">
                <div className="w-[14%] bg-primary/10 rounded-t-sm" style={{ height: "20%" }}></div>
                <div className="w-[14%] bg-primary/10 rounded-t-sm" style={{ height: "10%" }}></div>
                <div className="w-[14%] bg-primary/20 rounded-t-sm" style={{ height: "30%" }}></div>
                <div className="w-[14%] bg-primary/10 rounded-t-sm" style={{ height: "20%" }}></div>
                <div className="w-[14%] bg-primary/30 rounded-t-sm" style={{ height: "40%" }}></div>
                <div className="w-[14%] bg-primary/25 rounded-t-sm" style={{ height: "25%" }}></div>
              </div>
              <button
                onClick={() => {
                  setShowChat(true);
                  setInput("What are the key topics in Physics Chapter 4?");
                }}
                className="w-full bg-primary text-on-primary py-2 rounded-lg font-label-sm text-label-sm hover:bg-surface-tint transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chat</span> Chat
              </button>
            </div>

            {/* Attendance Agent */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-error-container/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>fact_check</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Monitoring</span>
                </div>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-1 relative z-10">Attendance Agent</h3>
              <p className="font-body-md text-body-md text-error mb-6 relative z-10 h-10 font-medium">2 alerts found. Risk of dropping below 80%.</p>
              <div className="w-full h-12 mb-6 border-b border-outline-variant/30 flex items-end justify-between px-1 relative z-10">
                <div className="w-[14%] bg-outline/20 rounded-t-sm" style={{ height: "100%" }}></div>
                <div className="w-[14%] bg-outline/20 rounded-t-sm" style={{ height: "100%" }}></div>
                <div className="w-[14%] bg-outline/20 rounded-t-sm" style={{ height: "100%" }}></div>
                <div className="w-[14%] bg-error/40 rounded-t-sm" style={{ height: "60%" }}></div>
                <div className="w-[14%] bg-outline/20 rounded-t-sm" style={{ height: "100%" }}></div>
                <div className="w-[14%] bg-error/60 rounded-t-sm" style={{ height: "40%" }}></div>
              </div>
              <button
                onClick={() => {
                  setShowChat(true);
                  setInput("Am I at risk of failing attendance thresholds?");
                }}
                className="w-full bg-error-container text-on-error-container py-2 rounded-lg font-label-sm text-label-sm hover:bg-error-container/80 transition-colors"
              >
                Check Attendance Alerts
              </button>
            </div>

            {/* Task Agent */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>task_alt</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary pulse-purple"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Active</span>
                </div>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-1 relative z-10">Task Agent</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 relative z-10 h-10">Automatically synchronising tasks from Firestore.</p>
              <div className="w-full h-12 mb-6 border-b border-outline-variant/30 flex items-end justify-between px-1 relative z-10">
                <div className="w-[14%] bg-secondary/10 rounded-t-sm" style={{ height: "10%" }}></div>
                <div className="w-[14%] bg-secondary/30 rounded-t-sm" style={{ height: "30%" }}></div>
                <div className="w-[14%] bg-secondary/20 rounded-t-sm" style={{ height: "20%" }}></div>
                <div className="w-[14%] bg-secondary/50 rounded-t-sm" style={{ height: "50%" }}></div>
                <div className="w-[14%] bg-secondary/80 rounded-t-sm" style={{ height: "80%" }}></div>
                <div className="w-[14%] bg-secondary rounded-t-sm" style={{ height: "95%" }}></div>
              </div>
              <button
                onClick={() => {
                  setShowChat(true);
                  setInput("Show my pending tasks.");
                }}
                className="w-full bg-surface-container text-on-surface py-2 rounded-lg font-label-sm text-label-sm hover:bg-surface-variant transition-colors"
              >
                Review Tasks
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Ippo Orchestration Chat & Trace Terminal */}
        {showChat && (
          <div className="w-full lg:w-[45%] flex flex-col h-[calc(100vh-8rem)] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg overflow-hidden animate-fade-in relative z-20">
            {/* Chat Header */}
            <div className="flex justify-between items-center bg-surface-container-low p-4 border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-title-md text-[15px] font-bold text-primary leading-none">Ippo Orchestrator</h3>
                  <span className="text-[10px] text-on-surface-variant font-medium">Core Coordinator Active</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChat(false);
                  setCurrentTrace([]);
                }}
                className="text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Chat Log Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-body-md ${
                    msg.role === "user"
                      ? "ml-auto bg-primary text-on-primary rounded-tr-none"
                      : "bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  
                  {msg.agent && (
                    <div className="mt-2 pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[10px] text-outline font-semibold">
                      <span>Agent: {msg.agent}</span>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 rounded-tl-none max-w-[85%]">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-on-surface-variant italic">Ippo is thinking...</span>
                </div>
              )}
            </div>

            {/* Live Orchestrator Execution Trace Indicator */}
            {currentTrace.length > 0 && (
              <div className="p-4 bg-surface-container border-t border-outline-variant font-mono text-[11px] text-on-surface-variant select-none max-h-48 overflow-y-auto">
                <p className="text-[10px] font-bold text-secondary uppercase mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Live Orchestration Trace:
                </p>
                <div className="space-y-1">
                  {currentTrace.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 animate-slide-in">
                      <span className="text-primary font-bold">›</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input Panel */}
            <form onSubmit={handleSendMessage} className="p-4 bg-surface-container-low border-t border-outline-variant flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask Ippo (e.g. 'Optimize my timetable this week')..."
                className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-tint transition-all disabled:opacity-55"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
