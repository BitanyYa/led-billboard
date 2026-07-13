const { spawnSync } = require("child_process");
const fs   = require("fs");
const path = require("path");

const root        = __dirname;
const frontendDir = path.join(root, "frontend");
const tscBin      = path.join(frontendDir, "node_modules", "typescript", "bin", "tsc");
const resultFile  = path.join(root, "tsc-result.txt");

// ── 1. Wipe every tsbuildinfo we can find ──────────────────
const toDelete = [
  path.join(frontendDir, "tsconfig.tsbuildinfo"),
  path.join(frontendDir, ".next", "cache", "tsbuildinfo.json"),
  path.join(frontendDir, ".next", "cache", "webpack", "server-production", "0.pack.gz"),
];
toDelete.forEach(f => {
  try { fs.unlinkSync(f); console.log("deleted:", f); } catch {}
});

// ── 2. Run tsc with NO cache flags ────────────────────────
const result = spawnSync(
  process.execPath,          // node itself
  [tscBin, "--noEmit"],
  { cwd: frontendDir, encoding: "utf8" }
);

const stdout = result.stdout || "";
const stderr = result.stderr || "";
const combined = stdout + stderr;
const exitCode = result.status ?? -1;

fs.writeFileSync(resultFile, `EXIT:${exitCode}\n${combined || "(no errors)"}`);
console.log(`tsc finished — exit ${exitCode} — ${combined.split("\n").length} lines`);
console.log(combined.slice(0, 2000) || "(no errors — clean build!)");
