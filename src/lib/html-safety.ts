const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escape untrusted text before interpolating into HTML email bodies or fragments.
 */
export function escapeHtml(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/**
 * Serialize JSON-LD safely for <script type="application/ld+json"> tags, preventing
 * closing-tag or HTML comment injection via `<`, `>`, `&`, U+2028, or U+2029.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
