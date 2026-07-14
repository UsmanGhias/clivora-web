import Link from "next/link";
import { Github, Mail } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { site } from "@/lib/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col">
              <span className="font-display text-xl font-extrabold tracking-wide text-navy">
                {marketing.brand.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                {marketing.brand.productLine} · by {site.company.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              {marketing.footer.blurb}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/40 hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${site.company.email}`}
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/40 hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(marketing.footer.columns).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy">{category}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {site.company.name}. {site.name} is a product of{" "}
            {site.company.name}.
          </p>
          <a
            href={site.company.url}
            className="text-sm text-slate-400 transition hover:text-primary"
          >
            {site.company.url.replace("https://", "")}
          </a>
        </div>
      </div>
    </footer>
  );
}
