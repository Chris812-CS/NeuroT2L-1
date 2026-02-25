import type { LessonV1, UIMode } from "./lessonSchema";
import type { PerformanceSummary } from "../runner/useLessonRunner";

function findIndexByUi(lessons: LessonV1[], ui: UIMode): number {
  const idx = lessons.findIndex((l) => l.defaults.ui === ui);
  return idx >= 0 ? idx : 0;
}

export function chooseNextLessonIndex(
  lessons: LessonV1[],
  perf: PerformanceSummary
): number {
  // Room2D → Bubble if mastered
  if (perf.lastMode === "room2d") {
    if (perf.room2dTargets > 0 && perf.room2dFound >= perf.room2dTargets) {
      return findIndexByUi(lessons, "floatingBubble");
    }
    // Confusion (many mis-taps and zero found) → stay room2d (later can load onboarding variant)
    if (perf.room2dFound === 0 && perf.room2dMisTaps >= 3) {
      return findIndexByUi(lessons, "room2d");
    }
    // Partial → stay room2d
    return findIndexByUi(lessons, "room2d");
  }

  // Bubble → PicSelection if fully popped
  if (perf.lastMode === "floatingBubble") {
    if (perf.bubbleTotal > 0 && perf.bubblePopped >= perf.bubbleTotal) {
      return findIndexByUi(lessons, "picSelection");
    }
    return findIndexByUi(lessons, "floatingBubble");
  }

  // PicSelection → Room2D if accuracy high; otherwise Bubble
  if (perf.lastMode === "picSelection") {
    const acc = perf.picTotal > 0 ? perf.picCorrect / perf.picTotal : 0;
    if (acc >= 0.8) return findIndexByUi(lessons, "room2d");
    return findIndexByUi(lessons, "floatingBubble");
  }

  return 0;
}
