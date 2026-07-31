import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export function Markdown({ content }: { content: string }) {
  return (
    <article className="docs-prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 font-display text-3xl font-extrabold text-navy sm:text-4xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-10 font-display text-xl font-bold text-navy sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-6 text-lg font-bold text-navy">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-text-secondary">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 text-text-secondary">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6 text-text-secondary">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => {
            const internal = href?.startsWith("/");
            if (internal && href) {
              return (
                <Link href={href} className="font-medium text-primary hover:underline">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                className="font-medium text-primary hover:underline"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="mb-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[480px] text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-background font-semibold">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-border px-4 py-3 text-navy">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-4 py-3 text-text-secondary">{children}</td>
          ),
          tr: ({ children }) => <tr className="even:bg-surface/50">{children}</tr>,
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="mb-4 overflow-x-auto rounded-xl bg-navy p-4 text-sm text-white">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-background px-1.5 py-0.5 text-sm text-primary-dark">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-4 border-primary pl-4 text-text-secondary italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-border" />,
          strong: ({ children }) => <strong className="font-semibold text-navy">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
