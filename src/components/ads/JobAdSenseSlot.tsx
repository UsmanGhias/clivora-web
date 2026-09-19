"use client";

import { useEffect, useRef } from "react";

interface JobAdSenseSlotProps {
  slotId?: string;
  format?: "in-article" | "sidebar" | "in-feed" | "banner";
  className?: string;
}

const DEFAULT_PUB_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-6149132910438736";

export function JobAdSenseSlot({
  slotId = "default-slot",
  format = "in-article",
  className = "",
}: JobAdSenseSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only attempt push once per DOM node
    if (isInitialized.current) return;

    try {
      if (typeof window !== "undefined") {
        const win = window as unknown as {
          adsbygoogle?: Array<Record<string, unknown>>;
        };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        isInitialized.current = true;
      }
    } catch {
      // Gracefully handle AdSense initialization / adblocker errors
    }
  }, []);

  // Format-specific container height and styling to prevent Cumulative Layout Shift (CLS)
  let containerStyles = "min-h-[140px] sm:min-h-[180px]";
  let layoutAttr: "in-article" | "fluid" | undefined;

  if (format === "in-article") {
    containerStyles = "min-h-[160px] sm:min-h-[220px]";
    layoutAttr = "in-article";
  } else if (format === "sidebar") {
    containerStyles = "min-h-[250px] max-w-[336px]";
  } else if (format === "in-feed") {
    containerStyles = "min-h-[120px]";
    layoutAttr = "fluid";
  } else if (format === "banner") {
    containerStyles = "min-h-[90px]";
  }

  return (
    <div
      className={`relative my-4 overflow-hidden text-center transition-all ${className}`}
    >
      <div className="flex w-full items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client={DEFAULT_PUB_ID}
          data-ad-slot={slotId !== "default-slot" ? slotId : undefined}
          data-ad-format={format === "in-feed" ? "fluid" : "auto"}
          data-ad-layout={layoutAttr}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
