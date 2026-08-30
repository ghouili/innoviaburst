/**
 * Fails the build if a secret has been put in the repo-root .env.
 *
 * That file is git-tracked, and Vite inlines every VITE_ value into the public
 * JS bundle — so anything there is published twice over. A Gmail App Password
 * has landed in it twice during development, which is why this is a build gate
 * rather than a comment in the file.
 *
 * The invariant is deliberately absolute and therefore easy to reason about:
 *
 *   the root .env may contain VITE_* keys and nothing else.
 *
 * A non-VITE_ key there is either a secret in the wrong place, or dead weight
 * Vite never exposes. Both are worth failing on. Server-side configuration
 * does not belong in this file at all.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = path.join(ROOT, ".env");

if (!fs.existsSync(ENV_FILE)) process.exit(0);

const offenders = [];
for (const [i, raw] of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/).entries()) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  if (key.startsWith("VITE_")) continue;
  offenders.push({ line: i + 1, key });
}

if (offenders.length === 0) process.exit(0);

const list = offenders.map((o) => `    .env:${o.line}  ${o.key}`).join("\n");
console.error(
  `\n✖ Non-VITE_ keys found in the repo-root .env:\n\n${list}\n\n` +
    `  That file is COMMITTED to git, and Vite inlines its VITE_ values into the\n` +
    `  public JS bundle. A credential there is published twice over.\n\n` +
    `  Move these to the environment of whatever consumes them; they do not belong here.\n` +
    `  If any of them is a real credential, revoke and regenerate it — it has\n` +
    `  already been written to a tracked file.\n`,
);
process.exit(1);
