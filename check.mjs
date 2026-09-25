// @ts-check
/**
 * check.mjs — one-shot project doctor.
 * Runs ALL checks, collects every problem, prints one report at the end.
 * Usage:  node check.mjs        (full, includes production build)
 *         node check.mjs --fast (skips the slow next build)
 */
import { execSync } from "node:child_process";
import { existsSync, statSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FAST = process.argv.includes("--fast");
const fail = [];
const warn = [];
const ok = [];

const rel = (p) => p.replace(ROOT, "").replace(/^[\\/]/, "");
const has = (p) => existsSync(join(ROOT, p));
const read = (p) => (has(p) ? readFileSync(join(ROOT, p), "utf8") : "");

function run(label, cmd) {
  process.stdout.write(`\n▶ ${label}\n`);
  try {
    const out = execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString();
    process.stdout.write(out);
    ok.push(label);
    return { ok: true, out };
  } catch (e) {
    const out = `${e.stdout || ""}${e.stderr || ""}`;
    process.stdout.write(out);
    fail.push(`${label} — see output above`);
    return { ok: false, out };
  }
}

// ---- 1. Required files -----------------------------------------------------
const required = [
  "package.json",
  "tsconfig.json",
  "next.config.mjs",
  "tailwind.config.ts",
  "postcss.config.js",
  ".eslintrc.json",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/globals.css",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
  "src/app/api/github/route.ts",
  "src/content/profile.ts",
  "src/content/stories.ts",
  "src/lib/site.ts",
  "src/lib/store.ts",
  "src/lib/sceneState.ts",
  "src/lib/worldProgress.ts",
  "src/lib/github.ts",
  "src/components/three/WorldDirector.tsx",
  "src/components/three/SceneCanvas.tsx",
  "src/components/three/Background.tsx",
  "src/components/sections/Hero.tsx",
  "src/components/sections/Projects.tsx",
  "src/components/sections/About.tsx",
  "src/components/sections/Skills.tsx",
  "src/components/sections/GitHubSection.tsx",
  "src/components/sections/Contact.tsx",
  "src/components/sections/Footer.tsx",
  "public/favicon.svg",
  "public/og.svg",
];
const worlds = ["Hero", "AI", "Electronics", "Robotics", "Mechanical", "Builder"];
for (const w of worlds) required.push(`src/components/three/worlds/${w}World.tsx`);

console.log("▶ Required files");
for (const f of required) {
  if (has(f)) ok.push(`file ${f}`);
  else fail.push(`MISSING FILE: ${f}`);
}
console.log(`  checked ${required.length} files`);

// ---- 2. Assets / content sanity -------------------------------------------
console.log("\n▶ Assets & content");
// résumé PDF present and not a tiny placeholder
if (!has("public/Raushan_Kumar_CV.pdf")) {
  warn.push("public/Raushan_Kumar_CV.pdf missing — the Résumé link will 404.");
} else {
  const size = statSync(join(ROOT, "public/Raushan_Kumar_CV.pdf")).size;
  if (size < 2000)
    warn.push(
      `public/Raushan_Kumar_CV.pdf is only ${size} bytes — looks like the placeholder. Replace with your real CV.`
    );
  else ok.push("résumé PDF present");
}

// node_modules present
if (!has("node_modules")) fail.push("node_modules missing — run npm install / INSTALL.bat.");
else ok.push("node_modules present");

// SWC platform binary (the earlier Windows crash)
if (process.platform === "win32" && !has("node_modules/@next/swc-win32-x64-msvc")) {
  warn.push(
    "Windows SWC binary not found — if build fails with 'valid Win32 application', run REINSTALL.bat."
  );
}

// ---- 3. Fabrication / placeholder guard -----------------------------------
console.log("▶ Honesty / placeholder scan");
const profile = read("src/content/profile.ts");
if (/\[PLACEHOLDER/i.test(profile))
  warn.push("profile.ts still contains [PLACEHOLDER ...] markers — fill or leave null intentionally.");
const srcFiles = listSrc();
for (const f of srcFiles) {
  const t = read(f);
  if (/\bTODO\b|\bFIXME\b/.test(t)) warn.push(`TODO/FIXME left in ${f}`);
  if (/lorem ipsum/i.test(t)) warn.push(`Placeholder 'lorem ipsum' text in ${f}`);
}

// env documented
if (!has(".env.example")) warn.push(".env.example missing (documents GITHUB_TOKEN / SITE_URL).");

// ---- 4. Toolchain checks ---------------------------------------------------
run("TypeScript typecheck (tsc --noEmit)", "npx tsc --noEmit");
run("ESLint (next lint)", "npx next lint");
if (FAST) {
  warn.push("Production build skipped (--fast). Run without --fast before deploying.");
} else {
  run("Production build (next build)", "npx next build");
}

// ---- 5. Report -------------------------------------------------------------
const line = "─".repeat(60);
console.log(`\n${line}\n  DOCTOR REPORT\n${line}`);
console.log(`  Passed:   ${ok.length}`);
console.log(`  Warnings: ${warn.length}`);
console.log(`  Failures: ${fail.length}`);

if (warn.length) {
  console.log(`\n  ⚠ WARNINGS (non-blocking):`);
  warn.forEach((w, i) => console.log(`   ${i + 1}. ${w}`));
}
if (fail.length) {
  console.log(`\n  ✖ FAILURES (must fix):`);
  fail.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
  console.log(`\n${line}\n  RESULT: FAIL — fix the failures above, then re-run.\n${line}`);
  process.exit(1);
}
console.log(
  `\n${line}\n  RESULT: ${warn.length ? "PASS (with warnings)" : "ALL GREEN"} 🎉\n${line}`
);
process.exit(0);

// ---- helpers ---------------------------------------------------------------
function listSrc() {
  const out = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(join(ROOT, dir), { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
    }
  };
  walk("src");
  return out;
}


