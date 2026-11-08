// Stop: si hay cambios en src/, corre tsc y eslint como el CI y devuelve los errores a Claude.
const fs = require("fs");
const { execSync } = require("child_process");

const input = JSON.parse(fs.readFileSync(0, "utf8"));
if (input.stop_hook_active) process.exit(0); // evita el bucle si ya se reintentó

const opts = { cwd: process.env.CLAUDE_PROJECT_DIR || input.cwd, stdio: "pipe", encoding: "utf8" };
const cambios = execSync("git status --porcelain -- src test", opts).trim();
if (!cambios) process.exit(0);

for (const cmd of ["npx tsc --noEmit", "npx eslint --quiet"]) {
  try {
    execSync(cmd, opts);
  } catch (e) {
    console.error(`"${cmd}" falló (el CI también fallará):\n${(e.stdout || "") + (e.stderr || "")}`.slice(0, 4000));
    process.exit(2);
  }
}
