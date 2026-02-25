import { useMemo, useState, useEffect } from "react";
import { assertLessonV1 } from "./engine/validateLesson";
import type { LessonV1 } from "./engine/lessonSchema";
import roomLesson from "./data/sampleLessons/room2d_lesson_1.json";
import bubbleLesson from "./data/sampleLessons/bubble_review_1.json";
import picLesson from "./data/sampleLessons/picselect_1.json";
import { useLessonRunner } from "./runner/useLessonRunner";
import UIRenderer from "./ui/renderer/UIRenderer";
import StandardBackground from "./ui/StandardBackground/StandardBackground";

const LESSONS = [
  roomLesson as unknown as LessonV1,
  bubbleLesson as unknown as LessonV1,
  picLesson as unknown as LessonV1,
];

export default function LessonPlayer() {
  const [idx, setIdx] = useState(0);

  const lesson = useMemo(() => {
    const l = LESSONS[idx];
    assertLessonV1(l);
    return l;
  }, [idx]);

  const runner = useLessonRunner(lesson);

  // Hard lock the page to prevent scroll (demo-safe)
  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyMargin = document.body.style.margin;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.margin = prevBodyMargin;
    };
  }, []);

  return (
    <StandardBackground>
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden", // prevents any accidental overflow scroll
        position: "relative",
      }}
    >
      <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
        <UIRenderer runner={runner} lesson={lesson} />
      </div>
    </div>
    </StandardBackground>
  );
}
