import { useMemo, useRef } from "react";
import { assertLessonV1 } from "./engine/validateLesson";
import type { LessonV1 } from "./engine/lessonSchema";
import classroomLesson from "./data/sampleLessons/room2d_lesson_1.json";
import { useLessonRunner } from "./runner/useLessonRunner";
import UIRenderer from "./ui/renderer/UIRenderer";
import StandardBackground from "./ui/StandardBackground/StandardBackground";

export default function LessonPlayer() {
  const lesson = useMemo(() => {
    assertLessonV1(classroomLesson as LessonV1);
    return classroomLesson as LessonV1;
  }, []);

  const runner = useLessonRunner(lesson);

  const downloadedRef = useRef(false);

  const handleFinish = () => {
    if (!downloadedRef.current) {
      runner.downloadPerformance();
      downloadedRef.current = true;
    }
    // TODO: your real exit behavior later
    console.log("Lesson finished:", lesson.lessonId);
  };

  return (
    <StandardBackground>
      <div style={{ height: "100vh", width: "100vw" }}>
        <UIRenderer runner={runner} lesson={lesson} onFinish={handleFinish} />
      </div>
    </StandardBackground>
  );
}
