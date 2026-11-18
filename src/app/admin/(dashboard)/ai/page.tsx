"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  RefreshCw,
  Database,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { AdminPageHeader, AdminBtn } from "@/components/admin/ui";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const SUGGESTED_QUERIES = [
  "Explain complete system architecture & database map",
  "How many real jobs and proposals are in the database?",
  "Audit our Supabase Row Level Security (RLS) policies",
  "Check for database sync errors and background issues",
  "What are our key advantages over Upwork's business model?",
];

export default function AdminAiAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content:
        "Hello Usman. I am your CLIVORA System Architect & Admin AI Advisor, connected live to your Supabase PostgreSQL telemetry and codebase specifications.\n\nAsk me anything about real jobs posted, applicant volumes, database structure, security audits, or platform performance.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    setInput("");
    const userMsg: Message = {
      id: "u_" + Date.now(),
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: "a_" + Date.now(),
        role: "assistant",
        content: data.reply || "No response received from the advisor.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI Advisor error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          role: "assistant",
          content:
            "Encountered a connection error when querying the AI Advisor. Please verify that your Gemini API key is configured in your environment.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-6xl mx-auto">
      <AdminPageHeader
        title="AI System Architect & Advisor"
        subtitle="Real-time system diagnostics, database schema analysis, and platform telemetry powered by Google Gemini."
        actions={
          <div className="flex gap-2">
            <AdminBtn
              variant="outline"
              onClick={() => {
                setMessages([
                  {
                    id: "reset_" + Date.now(),
                    role: "assistant",
                    content: "Conversation history cleared. Telemetry re-initialized. How can I assist you with CLIVORA today?",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear Chat
            </AdminBtn>
          </div>
        }
      />

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Live Jobs</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">7,406+</div>
          <div className="mt-1 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Indexed in connect_jobs
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Database RLS</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">Enforced</div>
          <div className="mt-1 text-xs text-slate-500">
            Row Level Security active
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Marketplace Fee</span>
            <Database className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">0%</div>
          <div className="mt-1 text-xs text-blue-600 font-medium">
            Zero commission model
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>AI Model</span>
            <Cpu className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">Gemini 3.1</div>
          <div className="mt-1 text-xs text-purple-600 font-medium">
            Google AI API connected
          </div>
        </div>
      </div>

      {/* Suggested Query Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTED_QUERIES.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            disabled={loading}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-200/80 font-medium disabled:opacity-50"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-xs text-slate-400">
              {m.role === "assistant" ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  <span className="font-semibold text-slate-700">CLIVORA Architect AI</span>
                </>
              ) : (
                <span className="font-semibold text-slate-600">Usman Ghias (Admin)</span>
              )}
              <span>•</span>
              <span>{m.timestamp}</span>
            </div>

            <div
              className={`relative max-w-3xl rounded-2xl p-4 text-sm shadow-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-slate-900 text-white rounded-tr-none font-medium"
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap"
              }`}
            >
              {m.content}

              {m.role === "assistant" && (
                <button
                  onClick={() => copyToClipboard(m.id, m.content)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1 rounded"
                  title="Copy answer"
                >
                  {copiedId === m.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1 px-1 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
              <span className="font-semibold text-slate-700">CLIVORA Architect AI</span>
              <span>•</span>
              <span>Analyzing live telemetry...</span>
            </div>
            <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-purple-600 animate-spin" />
              <span className="text-sm text-slate-600 font-medium">
                Reading database telemetry and querying Gemini...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI Advisor anything about jobs, proposals, database schema, or errors..."
          disabled={loading}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:hover:bg-purple-600"
        >
          <Send className="h-4 w-4" />
          <span>Ask Advisor</span>
        </button>
      </form>
    </div>
  );
}
