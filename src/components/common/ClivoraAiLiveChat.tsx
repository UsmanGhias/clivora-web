"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User, Trash2, ArrowRight } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  "How does 0% platform fee work?",
  "Browse remote React & Python jobs",
  "How do I complete my contractor profile?",
  "Hire verified senior engineers",
];

const INITIAL_GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Welcome to Clivora! I am Clivora AI, your 24/7 intelligent workspace assistant. How can I help you find remote jobs, hire senior talent with 0% platform fees, or assist with software engineering today?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export function ClivoraAiLiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("clivora_livechat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // Auto-prompt subtly after 8s if user hasn't opened yet
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("clivora_chat_auto_prompted")) {
        setHasPrompted(true);
        sessionStorage.setItem("clivora_chat_auto_prompted", "1");
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Save to sessionStorage
  useEffect(() => {
    try {
      if (messages.length > 1) {
        sessionStorage.setItem("clivora_livechat_history", JSON.stringify(messages));
      }
    } catch {
      // Ignore
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/livechat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          sourceUrl: typeof window !== "undefined" ? window.location.href : "clivora.io",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: "a_" + Date.now(),
        role: "assistant",
        content: data.reply || "I am here to help. Please explore clivora.io/jobs or reach out to contact@clivora.io.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Livechat send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          role: "assistant",
          content:
            "I encountered a momentary connection issue. You can explore over 7,150+ verified jobs at https://clivora.io/jobs or email us directly at contact@clivora.io.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([INITIAL_GREETING]);
    sessionStorage.removeItem("clivora_livechat_history");
  };

  const formatText = (text: string) => {
    // Basic Markdown link parser & newline preservation
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.match(/^https?:\/\//)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 dark:text-teal-400 font-semibold underline break-all hover:text-teal-700"
          >
            {part.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="relative">
          {hasPrompted && (
            <div className="absolute bottom-16 right-0 w-64 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl text-xs text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between gap-2">
                <p className="leading-snug">
                  👋 Have questions about 0% fee jobs or hiring senior engineers? Chat with Clivora AI!
                </p>
                <button
                  onClick={() => setHasPrompted(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setHasPrompted(false);
            }}
            className="group flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-teal-500/20 border border-slate-700/60 transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label="Open Clivora AI Live Chat"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-teal-500 text-slate-950 font-bold">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                Clivora AI
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-1.5 py-0.2 rounded">
                  24/7
                </span>
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-300">Ask any question &rarr;</span>
            </div>
          </button>
        </div>
      )}

      {/* Expanded Live Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[380px] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900 border-b border-slate-800 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-slate-950">
                <Bot className="w-5 h-5 text-slate-950" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                  Clivora AI
                  <span className="text-[10px] font-semibold text-teal-300 bg-teal-900/60 border border-teal-500/30 px-1.5 py-0.5 rounded">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Zero-Fee Remote Operating System</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear conversation"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/40 text-sm">
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div key={m.id} className={`flex gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}>
                  {isAssistant && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    isAssistant
                      ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-sm whitespace-pre-wrap"
                      : "bg-teal-600 text-white rounded-tr-sm font-medium whitespace-pre-wrap"
                  }`}>
                    {formatText(m.content)}
                    <div className={`text-[10px] mt-1.5 ${isAssistant ? "text-slate-400" : "text-teal-100"} text-right`}>
                      {m.timestamp}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Starter Prompts on new conversations */}
            {messages.length === 1 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Popular topics:
                </p>
                <div className="flex flex-col gap-1.5">
                  {STARTER_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(p)}
                      className="text-left text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-teal-400 rounded-lg px-3 py-2 transition flex items-center justify-between group"
                    >
                      <span>{p}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything or share your requirements..."
                disabled={isLoading}
                className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:hover:bg-teal-600 text-white p-2.5 rounded-xl transition flex items-center justify-center shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Powered by Gemini AI · Zero Platform Fees</span>
              <span>contact@clivora.io</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
