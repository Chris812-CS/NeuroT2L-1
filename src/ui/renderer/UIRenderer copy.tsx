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
}: {
  runner: Runner;
  lesson: LessonV1;
}) {
  // DEMO: manual UI cycling (revert later by using runner.uiMode directly)
  const [demoUI, setDemoUI] = useState<
    "room2d" | "floatingBubble" | "picSelection" | "sentenceBuilder"
  >("room2d");

  const perf = runner.getPerformanceSummary();

  // const progressText = useMemo(() => {
  //   if (runner.uiMode === "room2d") {
  //     return `Found: ${perf.room2dFound} / ${perf.room2dTargets}`;
  //   }
  //   if (runner.uiMode === "floatingBubble") {
  //     return `Popped: ${perf.bubblePopped} / ${perf.bubbleTotal}`;
  //   }
  //   if (runner.uiMode === "picSelection") {
  //     return `Correct: ${perf.picCorrect} / ${perf.picTotal}`;
  //   }
  //   return undefined;
  // }, [runner.uiMode, perf]);

  const progressText = useMemo(() => {
    if (demoUI === "room2d") {
      return `Found: ${perf.room2dFound} / ${perf.room2dTargets}`;
    }
    if (demoUI === "floatingBubble") {
      return `Popped: ${perf.bubblePopped} / ${perf.bubbleTotal}`;
    }
    if (demoUI === "picSelection") {
      return `Correct: ${perf.picCorrect} / ${perf.picTotal}`;
    }
    if (demoUI === "sentenceBuilder") {
      return `Sentence: practice`;
    }

    return undefined;
  }, [demoUI, perf]);

  // Hint highlight (Room2D only)
  const [hintObjectId, setHintObjectId] = useState<string | null>(null);
  const [hintForceShow, setHintForceShow] = useState(false);

  const onHint = () => {
    // if (runner.uiMode !== "room2d") return;
    if (demoUI !== "room2d") return;

    const cfg = lesson.defaults.room2d;
    if (!cfg) return;

    const nextObj = cfg.objects.find((o) => !runner.visitedObjectIds.has(o.id));
    if (!nextObj) return;

    setHintObjectId(nextObj.id);
    setHintForceShow(true);
  };

  // For now: Back closes overlay if open; Next does nothing (until you decide lesson navigation).
  // This avoids disabled grey buttons and keeps behavior safe.
  const onBack = runner.overlayOpen ? runner.closeOverlay : undefined;
  // const onNext = undefined;

  const onNext = () => {
    setHintForceShow(false);

    setDemoUI((cur) => {
      if (cur === "room2d") return "floatingBubble";
      if (cur === "floatingBubble") return "picSelection";
      if (cur === "picSelection") return "sentenceBuilder";
      return "room2d";
    });
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <LessonScaffold
        title={lesson.title}
        progressText={progressText}
        onBack={onBack}
        // onHint={onHint}
        onHint={demoUI === "room2d" ? onHint : undefined}
        onNext={onNext}
        onSettings={undefined}
      >
        {/* {runner.uiMode === "room2d" ? (
  <Room2DUI
    config={lesson.defaults.room2d!}
    onMisTap={() => {
      setHintForceShow(false);
      runner.trackRoom2dMisTap();
    }}
    onSelect={(itemId, objectId) => {
      setHintForceShow(false);
      runner.markVisited(objectId);
      runner.openItemById(itemId, { source: "room2d", sourceId: objectId });
    }}
    visited={runner.visitedObjectIds}
    
    hintHighlightObjectId={hintObjectId}
    hintForceShow={hintForceShow}
  />
)
 : runner.uiMode === "floatingBubble" ? (
          <FloatingBubbleUI
            items={lesson.items}
            onSelect={(itemId, bubbleId) => {
              runner.trackBubblePop();
              runner.markVisited(bubbleId);
              runner.openItemById(itemId, {
                source: "floatingBubble",
                sourceId: bubbleId,
              });
            }}
          />
        ) : runner.uiMode === "picSelection" ? (
          <PictureSelectionUI
            lesson={lesson}
            onSelectVocab={(targetId, choiceId, ok) => {
              runner.trackPicAttempt(ok);
              runner.markVisited(`pic:${targetId}:${choiceId}`);
            }}
          />
        ) : (
          <div style={{ padding: 16 }}>
            UI mode not implemented yet: <b>{runner.uiMode}</b>
          </div>
        )} */}

        {demoUI === "room2d" ? (
          <Room2DUI
            config={lesson.defaults.room2d!}
            onMisTap={() => {
              setHintForceShow(false);
              runner.trackRoom2dMisTap();
            }}
            onSelect={(itemId, objectId) => {
              setHintForceShow(false);
              runner.markVisited(objectId);
              runner.openItemById(itemId, { source: "room2d", sourceId: objectId });
            }}
            visited={runner.visitedObjectIds}
            hintHighlightObjectId={hintObjectId}
            hintForceShow={hintForceShow}
          />
        ) : demoUI === "floatingBubble" ? (
          <FloatingBubbleUI
            items={lesson.items}
            backgroundUrl={lesson.defaults.room2d?.background}
            onSelect={(itemId, bubbleId) => {
              runner.trackBubblePop();
              runner.markVisited(bubbleId);
              runner.openItemById(itemId, {
                source: "floatingBubble",
                sourceId: bubbleId,
              });
            }}
          />
        ) : demoUI === "picSelection" ? (
          <PictureSelectionUI
            lesson={lesson}
            onSelectVocab={(targetId, choiceId, ok) => {
              runner.trackPicAttempt(ok);
              runner.markVisited(`pic:${targetId}:${choiceId}`);
            }}
          />
        )  : demoUI === "sentenceBuilder" ? (
        (() => {
          const sb = lesson.defaults.sentenceBuilder;

          if (!sb) {
            return (
              <div style={{ padding: 16 }}>
                Missing <b>lesson.defaults.sentenceBuilder</b> config.
              </div>
            );
          }

          return (
            <SentenceBuilderLesson
              backgroundUrl={sb.background ?? lesson.defaults.room2d?.background}
              tokens={sb.tokens}
              wordBank={sb.wordBank}
              answers={sb.answers}
              onSubmitResult={({ isCorrect }) => {
                console.log("Sentence submit:", isCorrect);
              }}
            />
          );
        })()
      )
 : (
          <div style={{ padding: 16 }}>
            UI mode not implemented yet: <b>{demoUI}</b>
          </div>
        )}
      </LessonScaffold>

      {runner.overlayOpen && runner.overlayItem ? (
        <OverlayCard item={runner.overlayItem} onClose={runner.closeOverlay} />
      ) : null}
    </div>
  );
}
