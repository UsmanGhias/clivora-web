import Link from "next/link";
import { marketing } from "@/lib/marketing";
import { site } from "@/lib/site";
import {
  ColorfulMailIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "./SocialBrandIcons";

const socialLinks = [
  {
    label: "GitHub",
    href: site.social.github,
    Icon: GitHubIcon,
    className: "text-slate-900 hover:border-slate-900/40 hover:bg-slate-100",
  },
  {
    label: "Facebook",
    href: site.social.facebook,
    Icon: FacebookIcon,
    className: "text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10",
  },
  {
    label: "X",
    href: site.social.x,
    Icon: XIcon,
    className: "text-navy hover:border-navy/30 hover:bg-slate-100",
  },
  {
    label: "LinkedIn",
    href: site.social.linkedin,
    Icon: LinkedInIcon,
    className: "text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10",
  },
  {
    label: "Instagram",
    href: site.social.instagram,
    Icon: InstagramIcon,
    className: "text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10",
  },
  {
    label: "YouTube",
    href: site.social.youtube,
    Icon: YouTubeIcon,
    className: "text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10",
  },
  {
    label: "TikTok",
    href: site.social.tiktok,
    Icon: TikTokIcon,
    className: "text-navy hover:border-navy/30 hover:bg-slate-100",
  },
] as const;

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
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map(({ label, href, Icon, className }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${label}`}
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 transition ${className}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
              <a
                href={`mailto:${site.company.email}`}
                aria-label={`Email ${site.company.email}`}
                title="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 transition hover:border-primary/40 hover:bg-teal-50"
              >
                <ColorfulMailIcon className="h-5 w-5" />
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
            {site.company.name}. Founded by Usman Ghias.
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
