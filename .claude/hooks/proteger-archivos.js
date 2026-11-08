// PreToolUse (Edit|Write): bloquea reescribir migraciones ya existentes y el lockfile.
// Una migración nueva (archivo que aún no existe) sí se permite.
const fs = require("fs");
const path = require("path");

const input = JSON.parse(fs.readFileSync(0, "utf8"));
const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const rel = path.relative(root, path.resolve(root, file)).split(path.sep).join("/");

if (rel === "package-lock.json") {
  console.error("package-lock.json solo cambia con npm install/uninstall; no lo edites a mano.");
  process.exit(2);
}
if (rel.startsWith("supabase/migrations/") && fs.existsSync(path.resolve(root, file))) {
  console.error(`${rel} ya existe y puede estar aplicada en producción. Crea una migración nueva con el siguiente número.`);
  process.exit(2);
}
