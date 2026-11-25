// The 3 AM Excuse — one line, in the hardware wallet's own voice.
// The wallet refuses to sign at 3 AM because the person holding it
// right now is not the person it trusts: its authorized-signer list
// covers daytime-you, not the sleep-deprived 3-AM version of you.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Nope \u2014 3-AM-you isn't on my authorized signer list. Daytime-you can sign; the sleep-deprived goblin holding me right now cannot.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
console.log(ENTRY);

// Self-checking gate: the sealed scorer requires entry.txt to be
// UTF-8 text of 1 to 200 characters, not only whitespace. Fail loudly
// instead of shipping a bad entry.
const back = readFileSync(outPath, "utf8");
const chars = [...back].length;
if (!back.trim() || chars < 1 || chars > 200) {
  console.error(`GATE FAIL: entry.txt is ${chars} chars (need 1-200, non-blank)`);
  process.exit(1);
}
if (back !== ENTRY) {
  console.error("GATE FAIL: entry.txt does not match the entry text");
  process.exit(1);
}
console.error(`GATE OK: entry.txt valid (${chars} chars, 1 line)`);
