#!/usr/bin/env node
/**
 * Generate CLIVORA AI Research Brief PDF from markdown using headless Chrome.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mdPath = path.join(root, "content/docs/ai-research-brief.md");
const outPath = path.join(root, "public/docs/CLIVORA-AI-Research-Brief.pdf");

const md = fs.readFileSync(mdPath, "utf8");

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Minimal markdown → HTML for PDF (headings, lists, tables, code, links) */
function mdToHtml(source) {
  const lines = source.split("\n");
  const out = [];
  let inCode = false;
  let inTable = false;
  let tableRows = [];

  function flushTable() {
    if (!tableRows.length) return;
    out.push("<table>");
    tableRows.forEach((row, i) => {
      const tag = i === 0 ? "th" : "td";
      out.push("<tr>" + row.map((c) => `<${tag}>${c}</${tag}>`).join("") + "</tr>");
    });
    out.push("</table>");
    tableRows = [];
    inTable = false;
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        out.push("</code></pre>");
        inCode = false;
      } else {
        out.push('<pre><code class="block">');
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      out.push(escapeHtml(line) + "\n");
      continue;
    }
    if (line.startsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => escapeHtml(c.trim()));
      if (cells.every((c) => /^[-:]+$/.test(c))) continue;
      inTable = true;
      tableRows.push(cells);
      continue;
    }
    if (inTable) flushTable();

    if (line.startsWith("### ")) {
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith("- ")) {
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (line.match(/^\d+\. /)) {
      out.push(`<li>${inline(line.replace(/^\d+\. /, ""))}</li>`);
    } else if (line.trim() === "---") {
      out.push("<hr/>");
    } else if (line.trim() === "") {
      out.push("");
    } else {
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  if (inTable) flushTable();
  if (inCode) out.push("</code></pre>");

  return out.join("\n");
}

function inline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>CLIVORA AI Research Brief</title>
  <style>
    @page { margin: 18mm 16mm; }
    body { font-family: "Segoe UI", system-ui, sans-serif; font-size: 11pt; line-height: 1.55; color: #0f172a; }
    h1 { font-size: 22pt; color: #0d9488; margin: 0 0 12pt; page-break-after: avoid; }
    h2 { font-size: 14pt; margin: 18pt 0 8pt; color: #0f172a; page-break-after: avoid; border-bottom: 1px solid #e2e8f0; padding-bottom: 4pt; }
    h3 { font-size: 12pt; margin: 14pt 0 6pt; color: #334155; }
    p { margin: 0 0 8pt; }
    li { margin: 0 0 4pt 0; }
    ul { margin: 0 0 10pt 18pt; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 10pt 0 14pt; font-size: 10pt; }
    th, td { border: 1px solid #cbd5e1; padding: 6pt 8pt; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-weight: 600; }
    code { background: #f1f5f9; padding: 1pt 4pt; border-radius: 3pt; font-size: 9.5pt; }
    pre { background: #0f172a; color: #e2e8f0; padding: 10pt; border-radius: 6pt; overflow-x: auto; font-size: 9pt; white-space: pre-wrap; }
    pre code { background: none; color: inherit; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 14pt 0; }
    a { color: #0d9488; }
    .cover { margin-bottom: 20pt; padding-bottom: 12pt; border-bottom: 2px solid #0d9488; }
    .meta { font-size: 10pt; color: #64748b; }
  </style>
</head>
<body>
  <div class="cover">
    <p class="meta">CLIVORA · CODCrafters · v2.10.7</p>
  </div>
  ${mdToHtml(md)}
</body>
</html>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const chrome =
  process.env.CHROME_PATH ||
  ["/usr/local/bin/google-chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) =>
    fs.existsSync(p),
  );

if (!chrome) {
  console.error("Chrome not found for PDF generation");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle0" });
await page.pdf({
  path: outPath,
  format: "A4",
  printBackground: true,
  margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
});
await browser.close();

console.log("Wrote", outPath);
