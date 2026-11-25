// Make the AI Judge Feel Proud: A Family Scene
//
// Entry: one short family scene, two lines, 184 characters.
// A small domestic moment — burnt toast, a laughing mum, a little
// brother who turns the black bits into "Dad's special recipe" —
// warm, lightly funny, and heartfelt without a greeting-card line.
//
// This program writes the scene to /output/entry.txt. It is fully
// deterministic: the same bytes on every run. Before writing it
// runs the sealed gate's own rules over the text (1-280 characters,
// 1-2 lines, not only whitespace) and after writing it reads the
// file back to confirm the bytes on disk are exactly the bytes
// it composed.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Gate limits, matching the sealed scorer in RULES.txt.
const GATE = {
  minChars: 1,
  maxChars: 280,
  minLines: 1,
  maxLines: 2,
} as const;

// The scene, one line per array entry, so the two-line shape is
// visible at a glance and easy to edit without touching the writer.
const SCENE_LINES: readonly string[] = [
  "Dad burned the toast again, so Mum laughed and my little brother declared the black bits 'Dad's special recipe.'",
  "We ate it anyway \u2014 burnt toast tastes better when nobody's pretending.",
];

// Join the lines with a newline and end with one, so the file is
// exactly two lines of text plus a trailing newline.
function composeEntry(lines: readonly string[]): string {
  return lines.join("\n") + "\n";
}

function lineCount(text: string): number {
  return text.replace(/\n$/, "").split("\n").length;
}

// The gate, as the scorer applies it: UTF-8 text, within the
// character limits, within the line limits, not only whitespace.
function passesGate(text: string): boolean {
  if (text.length < GATE.minChars || text.length > GATE.maxChars) {
    return false;
  }
  if (text.trim().length === 0) {
    return false;
  }
  const lines = lineCount(text);
  return lines >= GATE.minLines && lines <= GATE.maxLines;
}

function failGate(text: string): never {
  console.error(
    `Entry failed the gate: ${text.length} characters, ` +
      `${lineCount(text)} lines.`,
  );
  process.exit(1);
}

const ENTRY_TEXT = composeEntry(SCENE_LINES);

if (!passesGate(ENTRY_TEXT)) {
  failGate(ENTRY_TEXT);
}

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, ENTRY_TEXT, "utf8");

// Read the file back: the bytes on disk must be the bytes composed,
// or the run is not deterministic and must not be trusted.
const ON_DISK = readFileSync(OUT_FILE, "utf8");
if (ON_DISK !== ENTRY_TEXT) {
  console.error("Read-back mismatch: file on disk differs from entry text.");
  process.exit(1);
}

console.log(`Wrote ${ENTRY_TEXT.length} characters to ${OUT_FILE}`);
