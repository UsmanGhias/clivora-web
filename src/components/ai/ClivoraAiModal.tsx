"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ClivoraAiWorkspace } from "./ClivoraAiWorkspace";

export function ClivoraAiModal({
  open,
  onClose,
  initialTab = "proposals",
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: "proposals" | "invoices" | "health";
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clivora-ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      {/* Light dismiss backdrop */}
      <div
        className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Assistant"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-background/80 text-text-muted hover:bg-background hover:text-navy transition shadow-sm border border-border/50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Workspace Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ClivoraAiWorkspace
            initialTab={initialTab}
            onClose={onClose}
            embeddedInModal={true}
          />
        </div>
      </div>
    </div>
  );
}
