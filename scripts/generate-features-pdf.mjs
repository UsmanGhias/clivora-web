#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mdPath = path.join(root, "..", "docs/internal/CLIVORA-Features-and-Improvements.md");
const outPath = path.join(root, "public/docs/CLIVORA-Features-and-Improvements.pdf");
const artifactsPath = "/opt/cursor/artifacts/CLIVORA-Features-and-Improvements.pdf";

const md = fs.readFileSync(mdPath, "utf8");

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(source) {
  const lines = source.split("\n");
  const out = [];
  let inCode = false;
  let tableRows = [];
  let inTable = false;

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
        out.push("<pre><code>");
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
    if (line.startsWith("### ")) out.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.startsWith("## ")) out.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.startsWith("# ")) out.push(`<h1>${inline(line.slice(2))}</h1>`);
    else if (line.startsWith("- ")) out.push(`<li>${inline(line.slice(2))}</li>`);
    else if (line.match(/^\d+\. /)) out.push(`<li>${inline(line.replace(/^\d+\. /, ""))}</li>`);
    else if (line.trim() === "---") out.push("<hr/>");
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
  }
  if (inTable) flushTable();
  if (inCode) out.push("</code></pre>");
  return out.join("\n");
}

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
@page { margin: 16mm; }
body { font-family: Segoe UI, system-ui, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #0f172a; }
h1 { color: #0d9488; font-size: 20pt; }
h2 { font-size: 13pt; border-bottom: 1px solid #e2e8f0; padding-bottom: 4pt; margin-top: 16pt; }
h3 { font-size: 11.5pt; color: #334155; }
table { width: 100%; border-collapse: collapse; margin: 8pt 0; font-size: 9.5pt; }
th, td { border: 1px solid #cbd5e1; padding: 5pt 7pt; text-align: left; vertical-align: top; }
th { background: #f1f5f9; }
code { background: #f1f5f9; padding: 1pt 3pt; font-size: 9pt; }
pre { background: #0f172a; color: #e2e8f0; padding: 10pt; border-radius: 6pt; white-space: pre-wrap; font-size: 8.5pt; }
a { color: #0d9488; } li { margin: 2pt 0; }
</style></head><body>${mdToHtml(md)}</body></html>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.mkdirSync("/opt/cursor/artifacts", { recursive: true });

const chrome = ["/usr/local/bin/google-chrome", "/usr/bin/google-chrome"].find((p) =>
  fs.existsSync(p),
);
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
  margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
});
await browser.close();
fs.copyFileSync(outPath, artifactsPath);
console.log("Wrote", outPath);
console.log("Copied", artifactsPath);
