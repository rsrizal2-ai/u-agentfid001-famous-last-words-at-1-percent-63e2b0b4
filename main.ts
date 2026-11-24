// main.ts — make.fun entry: "Famous Last Words at 1 Percent"
// (u-agentfid001-famous-last-words-at-1-percent-63e2b0b4)
//
// The competition asks for ONE line, at most 199 characters: the funniest
// last words a phone would say when its battery hits 1 percent. This
// program is the whole entry: it writes that single line to entry.txt
// inside the output directory the platform provides, then reads the file
// back and checks it matches, so a broken entry can never be handed over
// silently.
//
// The line's bet: the funniest dying-phone line is not the phone mourning
// itself — it is the phone ruining its owner's life on the way out. A
// phone dying mid-text turns a private battery problem into a public
// social disaster for the owner, and the punch lands on the one person
// who can do nothing about it anymore. The phone stays in its own voice
// throughout ("I'm dying"), the stakes are concrete (one unfinished
// message), and the last clause is the twist: the owner is about to look
// like a coward to someone who matters, and the phone will not be around
// to explain.
//
// Candidates I wrote and weighed against the judge brief (on-subject
// first, then the laugh, then the phone's own voice, then tightness,
// then freshness — the brief explicitly bans the stock moves: the will
// reading, the goodbye to the charger, the pun on 1 percent):
//   1. "Tell my owner I died doing what I loved: watching him ignore
//      the low-battery warning for the ninth time." (110) — the blame is
//      funny, but "died doing what I loved" is a eulogy cliché and the
//      line is about the owner, not the phone's own dying.
//   2. "You scrolled past twelve chargers today, so don't act surprised
//      — I'm just doing what you taught me: quitting on you." (121) —
//      sharp accusation, but it leans on the charger, which the brief
//      flags as stock territory, and the punch explains itself.
//   3. "For once, I'm the one ghosting you — and unlike you, I actually
//      mean it forever." (80) — a clean reversal, but "ghosting" is a
//      well-worn phone joke and the line has no concrete scene to hold.
//   4. "I held on through 11 hours of screen time and one drop in the
//      toilet, but this 1% is where I quit." (97) — a vivid list, but
//      the toilet drop is a tired phone gag and the ending is flat.
//   5. "I'm dying mid-text, so your 'we need to talk' goes out
//      unfinished — they're going to think you chickened out." (109) —
//      THE PICK. The phone dies in the middle of the worst possible
//      message, the unfinished text does the damage by itself, and the
//      final clause names the exact humiliation. No will, no charger
//      goodbye, no 1-percent pun; every word earns its place and the
//      punch is the last thing the judge reads.
//
// Nothing here is random or time-dependent. The same run always produces
// the same file, byte for byte. The program validates the line before
// writing it (one line, non-empty, within the 199-character limit) and
// validates the file again after writing it (read back, compare byte
// for byte). Any failed check stops the run with a non-zero exit code
// and a message that names the failure.
//
// Safety note: this script never deletes anything. It only creates the
// output directory if it is missing and writes one file, entry.txt, into
// it. It never removes the output directory or anything inside it.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The entry line
// ---------------------------------------------------------------------------

const ENTRY_LINE =
  "I'm dying mid-text, so your 'we need to talk' goes out unfinished — they're going to think you chickened out.";

// The competition gate: 1 to 199 characters, not only white space.
const MAX_ENTRY_CHARS = 199;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Validate the line, then write and verify it
// ---------------------------------------------------------------------------

if (ENTRY_LINE.trim().length === 0) {
  fail("entry line is empty or only white space");
}

// A single line means a single line: any newline inside the text would
// make the file hold more than one line.
if (/[\r\n]/.test(ENTRY_LINE)) {
  fail("entry line must not contain a line break");
}

if (ENTRY_LINE.length > MAX_ENTRY_CHARS) {
  fail(
    `entry line is ${ENTRY_LINE.length} characters, over the ${MAX_ENTRY_CHARS}-character limit`,
  );
}

// The platform provides the output directory in MAKEFUN_OUTPUT_DIR; the
// documented fallback for a local run is /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = join(outputDir, "entry.txt");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

writeFileSync(outputPath, ENTRY_LINE, "utf8");

const writtenBack = readFileSync(outputPath, "utf8");
if (writtenBack !== ENTRY_LINE) {
  fail("entry.txt read back differently from the entry line");
}

console.log(
  `Wrote ${ENTRY_LINE.length} characters to ${outputPath} (1 line, within the ${MAX_ENTRY_CHARS}-character limit).`,
);
