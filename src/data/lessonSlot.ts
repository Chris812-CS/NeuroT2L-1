import type { LessonV1 } from "../engine/lessonSchema";

let _lesson: LessonV1 | null = null;

export function setLessonSlot(lesson: LessonV1) {
  _lesson = lesson;
}

export function getLessonSlot(): LessonV1 {
  if (!_lesson) {
    throw new Error("Lesson slot is empty. Go through Structure page first.");
  }
  return _lesson;
}

// ✅ NEW: non-throwing read
export function peekLessonSlot(): LessonV1 | null {
  return _lesson;
}

// ✅ NEW: clear after consuming
export function clearLessonSlot() {
  _lesson = null;
}