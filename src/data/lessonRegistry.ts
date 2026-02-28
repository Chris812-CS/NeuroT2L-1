import type { LessonV1 } from "../engine/lessonSchema";
import fullTemplate from "../data/sampleLessons/room2d_lesson_1.json";

export type ModeKey = "picSelection" | "sentenceBuilder" | "floatingBubble" | "room2d";

/** Utility: deep clone for safe mutation */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Decide which UI is the "starting" UI.
 * You can change priority easily here.
 */
const START_PRIORITY: ModeKey[] = ["room2d", "picSelection", "floatingBubble", "sentenceBuilder"];

function pickStartUI(selected: ModeKey[]): ModeKey {
  for (const m of START_PRIORITY) if (selected.includes(m)) return m;
  return selected[0];
}

export function buildLessonFromSelection(selected: ModeKey[]): LessonV1 {
  if (!selected || selected.length === 0) {
    throw new Error("No modes selected");
  }

  const s = new Set<ModeKey>(selected);

  // Treat template as LessonV1 (your JSON should match schema)
  const out = deepClone(fullTemplate) as unknown as LessonV1;

  // Identity
  out.lessonId = `${out.lessonId}__${selected.join("_")}__v1`;
  out.title = `${out.title} (${selected.join(", ")})`;

  // Start UI
  const start = pickStartUI(selected);
  out.defaults = out.defaults ?? ({} as any);
  (out.defaults as any).ui = start;

  // ---- Filter defaults sections ----
  if (!s.has("room2d")) delete (out.defaults as any).room2d;
  if (!s.has("sentenceBuilder")) delete (out.defaults as any).sentenceBuilder;
  if (!s.has("floatingBubble")) delete (out.defaults as any).floatingBubble;

  // ---- Filter content sections ----
  if (out.content) {
    if (!s.has("picSelection")) delete (out.content as any).picSelection;
    if (!s.has("sentenceBuilder")) delete (out.content as any).sentenceBuilder;
    if (!s.has("floatingBubble")) delete (out.content as any).floatingBubble;
    if (!s.has("room2d")) delete (out.content as any).room2d;
  }

  // ---- Feature toggles (optional) ----
  if ((out.defaults as any)?.features) {
    (out.defaults as any).features.picSelection = s.has("picSelection");
  }

  // Sanity: must keep at least one mode
  const keptAnyMode = s.size > 0;
  if (!keptAnyMode) throw new Error("Selection produced an empty lesson");

  return out;
}