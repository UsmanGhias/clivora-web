"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  /** Text color for dark headers vs light surfaces */
  variant?: "onDark" | "onLight";
  className?: string;
}

const sizes = {
  sm: { img: 32, text: "text-base", gap: "gap-2" },
  md: { img: 40, text: "text-xl", gap: "gap-2.5" },
  lg: { img: 56, text: "text-2xl", gap: "gap-3" },
  xl: { img: 72, text: "text-3xl", gap: "gap-4" },
};

/** Canonical CLIVORA mark + wordmark, use everywhere (app, Connect, Pro, admin). */
export function Logo({
  size = "md",
  showText = true,
  variant = "onDark",
  className,
}: LogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <div
        className="relative shrink-0 overflow-hidden rounded-xl shadow-md shadow-black/20"
        style={{ width: s.img, height: s.img }}
      >
        <Image
          src="/clivora_logo.png"
          alt="CLIVORA"
          width={s.img}
          height={s.img}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {showText && (
        <span
          className={cn(
            "font-extrabold tracking-[0.12em]",
            s.text,
            variant === "onDark" ? "text-white" : "text-navy",
          )}
        >
          CLIVORA
        </span>
      )}
    </div>
  );
}
