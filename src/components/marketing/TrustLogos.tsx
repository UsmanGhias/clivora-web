import { marketing } from "@/lib/marketing";

export function TrustLogos({
  title = marketing.trustBar.title,
  logos = marketing.trustBar.logos as readonly string[],
}: {
  title?: string;
  logos?: readonly string[];
}) {
  return (
    <section className="border-y border-slate-200/80 bg-white py-10">
      <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {logos.map((name) => (
            <span
              key={name}
              className="font-display text-sm font-bold tracking-wide text-slate-300 transition hover:text-slate-500 sm:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
