import Image from "next/image";
import { cn } from "@/lib/utils";

/** Full-bleed mockup frame for marketing showcase PNGs. */
export function ShowcaseImage({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        priority={priority}
        className="h-auto w-full object-cover object-top"
        sizes="(max-width: 1024px) 100vw, 1120px"
      />
    </div>
  );
}
