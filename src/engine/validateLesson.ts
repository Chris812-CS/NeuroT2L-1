// src/engine/validateLesson.ts
import type { LessonV1 } from "./lessonSchema";

function isNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function assertLessonV1(lesson: LessonV1): void {
  if (!lesson || typeof lesson !== "object") throw new Error("Lesson missing");
  if (lesson.version !== 1) throw new Error("Lesson version must be 1");
  if (!lesson.lessonId) throw new Error("lessonId missing");
  if (!lesson.title) throw new Error("title missing");
  if (!lesson.defaults?.ui) throw new Error("defaults.ui missing");
  if (!lesson.defaults?.features) throw new Error("defaults.features missing");
  if (!Array.isArray(lesson.items)) throw new Error("items must be an array");

  // Validate Room2D config if ui is room2d
  const room = lesson.defaults.room2d;
  if (lesson.defaults.ui === "room2d") {
    if (!room) throw new Error("defaults.room2d missing for room2d lesson");
    if (!room.background) throw new Error("room2d.background missing");
    if (!Array.isArray(room.objects)) throw new Error("room2d.objects must be array");

    for (const o of room.objects) {
      if (!o.id) throw new Error("room2d object missing id");
      if (!o.itemId) throw new Error(`room2d object ${o.id} missing itemId`);
      for (const k of ["x", "y", "w", "h"] as const) {
        if (!isNumber(o[k])) throw new Error(`room2d object ${o.id} missing ${k}`);
        if (o[k] < 0 || o[k] > 100) throw new Error(`room2d object ${o.id} ${k} out of range`);
      }
    }
  }
}
