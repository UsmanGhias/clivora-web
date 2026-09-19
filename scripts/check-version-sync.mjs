#!/usr/bin/env node
/**
 * Version drift guard.
 *
 * The canonical product manifest (src/config/product.ts) is only a source of
 * truth if something enforces it. This asserts that the manifest, site.ts,
 * package.json, and the Flutter app all agree.
 *
 * The Flutter checks are skipped when the mobile repo is not checked out
 * beside this one, so CI on the web repo alone still passes.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mobileRoot = resolve(root, "..", "Clivora");

const read = (p) => readFileSync(p, "utf8");
const grab = (src, re, label) => {
  const m = src.match(re);
  if (!m) throw new Error(`could not read ${label}`);
  return m[1];
};

const failures = [];
const checks = [];

const check = (label, actual, expected, source) => {
  checks.push({ label, actual, expected, source });
  if (String(actual) !== String(expected)) {
    failures.push(`${label}: manifest says ${actual}, ${source} says ${expected}`);
  }
};

const productSrc = read(resolve(root, "src/config/product.ts"));
const siteSrc = read(resolve(root, "src/lib/site.ts"));
const pkg = JSON.parse(read(resolve(root, "package.json")));

const manifest = {
  web: grab(productSrc, /versions:\s*\{[^}]*?web:\s*"([^"]+)"/s, "versions.web"),
  android: grab(productSrc, /versions:\s*\{[^}]*?android:\s*"([^"]+)"/s, "versions.android"),
  driftSchema: grab(productSrc, /versions:\s*\{[^}]*?driftSchema:\s*(\d+)/s, "versions.driftSchema"),
};

check("versions.web", manifest.web, pkg.version, "package.json");
const siteAppVersion = siteSrc.includes("productManifest.versions.android")
  ? manifest.android
  : grab(siteSrc, /appVersion:\s*"([^"]+)"/, "site.appVersion");
check("versions.android", manifest.android, siteAppVersion, "src/lib/site.ts");

if (existsSync(resolve(mobileRoot, "pubspec.yaml"))) {
  const pubspec = read(resolve(mobileRoot, "pubspec.yaml"));
  check("versions.android", manifest.android, grab(pubspec, /^version:\s*([0-9.]+)\+/m, "pubspec version"), "pubspec.yaml");

  const dbPath = resolve(mobileRoot, "lib/data/database/database.dart");
  if (existsSync(dbPath)) {
    check("versions.driftSchema", manifest.driftSchema, grab(read(dbPath), /int\s+get\s+schemaVersion\s*=>\s*(\d+)/, "drift schemaVersion"), "database.dart");
  }
} else {
  console.log("note: mobile repo not found beside this one, skipping Flutter checks");
}

for (const c of checks) {
  console.log(`${c.actual === c.expected ? "ok  " : "FAIL"} ${c.label} = ${c.actual} (vs ${c.source}: ${c.expected})`);
}

if (failures.length) {
  console.error("\nVersion drift detected:");
  for (const f of failures) console.error(`  - ${f}`);
  console.error("\nUpdate src/config/product.ts and src/lib/site.ts to match, then rerun.");
  process.exit(1);
}

console.log("\nAll version fields in sync.");
