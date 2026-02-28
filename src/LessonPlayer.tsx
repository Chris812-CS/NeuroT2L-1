import { useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { assertLessonV1 } from "./engine/validateLesson";
import type { LessonV1 } from "./engine/lessonSchema";
import { peekLessonSlot, clearLessonSlot } from "./data/lessonSlot";
import lesson1Json from "./data/sampleLessons/room2d_lesson_1.json";
import lesson2Json from "./data/sampleLessons/sample_lesson1.json";
import lesson3Json from "./data/sampleLessons/sample_lesson2.json";

import { useLessonRunner } from "./runner/useLessonRunner";
import UIRenderer from "./ui/renderer/UIRenderer";
import StandardBackground from "./ui/StandardBackground/StandardBackground";

function pickDemoLesson(which: string | null): LessonV1 {
  if (which === "2") return lesson2Json as unknown as LessonV1;
  if (which === "3") return lesson3Json as unknown as LessonV1;
  return lesson1Json as unknown as LessonV1;
}

export default function LessonPlayer() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const lessonParam = params.get("lesson"); // "1" | "2" | "3" | null

  // clear slot once (keep your behavior)
  const clearedRef = useRef(false);
  if (!clearedRef.current) {
    const slot = peekLessonSlot();
    if (slot) clearLessonSlot();
    clearedRef.current = true;
  }

  const lesson = useMemo(() => {
    const slot = peekLessonSlot(); // if you still want slot to override query
    const chosen = (slot ?? pickDemoLesson(lessonParam)) as LessonV1;
    assertLessonV1(chosen);
    return chosen;
  }, [lessonParam]);

  const runner = useLessonRunner(lesson);

  const finishedRef = useRef(false);
  const handleFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    console.log("Lesson finished:", lesson.lessonId);
    navigate("/", { replace: true });
  };

  return (
    <StandardBackground>
      <div style={{ height: "100vh", width: "100vw" }}>
        <UIRenderer
          key={lesson.lessonId}   // IMPORTANT: reset UI cleanly per lesson
          runner={runner}
          lesson={lesson}
          onFinish={handleFinish}
        />
      </div>
    </StandardBackground>
  );
}