import { useMemo, useState } from "react";
import type { LessonV1 } from "../../engine/lessonSchema";
import type { Runner } from "../../runner/useLessonRunner";
import OverlayCard from "../shared/OverlayCard";
import Room2DUI from "../modes/room2d/Room2DUI";
import FloatingBubbleUI from "../modes/floatingBubble/floatingBubble";
import PictureSelectionUI from "../modes/picSelection/pictureSelection";
import LessonScaffold from "../LessonScaffold/LessonScaffold";
import SentenceBuilderLesson from "../modes/SentenceBuilder/SentenceBuilderLesson";

export default function UIRenderer({
  runner,
  lesson,
  onFinish,
}: {
  runner: Runner;
  lesson: LessonV1;
  onFinish: () => void;
}) {
  const perf = runner.getPerformanceSummary();
  const ui = runner.uiMode;

  const progressText = useMemo(() => {
    if (ui === "room2d") return `Room Practice`;
    if (ui === "floatingBubble") return `Bubble Practice`;
    if (ui === "picSelection") return `Picture Practice`;
    if (ui === "sentenceBuilder") return `Sentence Practice`;
    return undefined;
  }, [ui]);

  const [hintObjectId, setHintObjectId] = useState<string | null>(null);
  const [hintForceShow, setHintForceShow] = useState(false);

  const onNext = () => {
    runner.clearHintForce();
    runner.goNext();
  };


  return (
    <div style={{ height: "100%", position: "relative" }}>
      <LessonScaffold
        title={lesson.title}
        progressText={progressText}
        onNext={onNext}
        onHint={runner.uiMode === "room2d" ? runner.requestHint : undefined}
        onBack={onFinish}
        onSettings={undefined}
      >
        {ui === "room2d" && lesson.defaults.room2d && (
        <Room2DUI
          config={lesson.defaults.room2d!}
          onMisTap={() => {
            runner.clearHintForce();
            runner.trackRoom2dMisTap();
          }}
          onSelect={(itemId, objectId) => {
            runner.clearHintForce();
            runner.markVisited(objectId);
            runner.openItemById(itemId, { source: "room2d", sourceId: objectId });
          }}
          visited={runner.visitedObjectIds}
          hintHighlightObjectId={runner.hintHighlightObjectId}
          hintForceShow={runner.hintForceShow}
        />

        )}

        {ui === "floatingBubble" && (
          <FloatingBubbleUI
            items={lesson.items}
            backgroundUrl={
              lesson.defaults.sentenceBuilder?.background ??
              lesson.defaults.room2d?.background ??
              lesson.defaults.background
            }
            onSelect={(itemId, bubbleId) => {
              runner.trackBubblePop(); // ✅ add this
              runner.openItemById(itemId, {
                source: "floatingBubble",
                sourceId: bubbleId,
              });
            }}
          />
        )}

        {ui === "picSelection" && lesson.content?.picSelection && (
        <PictureSelectionUI
        backgroundUrl={
          lesson.defaults.sentenceBuilder?.background ??
          lesson.defaults.room2d?.background ??
          lesson.defaults.background
        }

          lesson={lesson}
          onSelectVocab={(targetId, choiceId, ok) => {
            runner.trackPicAttempt(ok);

            if (ok) {
              runner.openItemById(choiceId, {
                source: "picSelection",
                sourceId: targetId,
              });
            }
          }}
        />

        )}

        {ui === "sentenceBuilder" && lesson.defaults.sentenceBuilder && (
          <SentenceBuilderLesson
            backgroundUrl={
              lesson.defaults.sentenceBuilder?.background ??
              lesson.defaults.room2d?.background ??
              lesson.defaults.background
            }
            tokens={lesson.defaults.sentenceBuilder.tokens}
            wordBank={lesson.defaults.sentenceBuilder.wordBank}
            answers={lesson.defaults.sentenceBuilder.answers}
            onSubmitResult={({ isCorrect }) => {
              if (isCorrect === null) return;
              runner.trackSentenceAttempt(!!isCorrect);
            }}
          />
        )}


      </LessonScaffold>

      {runner.overlayOpen && runner.overlayItem && (
        <OverlayCard
          item={runner.overlayItem}
          onClose={runner.closeOverlay}
        />
      )}
    </div>
  );
}
