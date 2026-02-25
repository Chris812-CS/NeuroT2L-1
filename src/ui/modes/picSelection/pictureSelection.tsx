import { useEffect, useMemo, useState } from "react";
import type { LessonV1, LessonItem } from "../../../engine/lessonSchema";
import "./pictureSelection.css";

type VocabItem = LessonItem & {
  type: "vocab";
  content: { word?: string; imgUrl?: string };
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PictureSelectionUI({
  lesson,
  onSelectVocab,
  // Optional: if you want internal Back/Hint buttons like the mock
  onBack,
  onHint,
  // Optional: override background if you want to reuse the room image
  backgroundUrl,
}: {
  lesson: LessonV1;
  onSelectVocab: (targetId: string, choiceId: string, ok: boolean) => void;
  onBack?: () => void;
  onHint?: () => void;
  backgroundUrl?: string;
}) {
  const vocab = useMemo(() => {
    return lesson.items.filter((it) => it.type === "vocab") as VocabItem[];
  }, [lesson.items]);

  const total = vocab.length;

  // target index cycles through vocab list
  const [targetIdx, setTargetIdx] = useState(0);

  // choices for current question
  const [choices, setChoices] = useState<VocabItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const target = vocab[targetIdx] ?? null;

  const foundCount = useMemo(() => {
    // simple: count correct answers as progress
    // if you already track progress in runner, pass it via props and show it instead
    return targetIdx; // feels natural: "Found: X / N"
  }, [targetIdx]);

  // Build 4 choices (1 correct + 3 distractors)
  useEffect(() => {
    if (!target || vocab.length === 0) return;

    const distractors = vocab.filter((v) => v.id !== target.id);
    const pick3 = shuffle(distractors).slice(0, 3);

    setChoices(shuffle([target, ...pick3]));
    setSelectedId(null);
    setStatus("idle");
  }, [target?.id, vocab]);

  const bg = backgroundUrl ?? lesson.defaults?.room2d?.background;

  const promptWord = target?.content?.word ?? "the item";

  const handlePick = (choice: VocabItem) => {
    if (!target) return;
    if (status !== "idle") return; // lock while showing feedback

    const ok = choice.id === target.id;
    setSelectedId(choice.id);
    setStatus(ok ? "correct" : "wrong");
    onSelectVocab(target.id, choice.id, ok);

    // neuro-friendly pacing: short feedback, then advance if correct
    if (ok) {
      window.setTimeout(() => {
        setTargetIdx((i) => (i + 1 < total ? i + 1 : 0));
      }, 650);
    } else {
      // if wrong, let them try again after a short pause
      window.setTimeout(() => {
        setSelectedId(null);
        setStatus("idle");
      }, 700);
    }
  };

  // Hint: lightly pulse the correct card
  const hintTargetId = status === "idle" ? target?.id : undefined;

  return (
    <div className="psPage">
      {/* background */}
      <div
        className="psBg"
        style={
          bg
            ? { backgroundImage: `url(${bg})` }
            : undefined
        }
      />
      <div className="psBgOverlay" />

      {/* sparkles layer */}
      <div className="psSparkles" aria-hidden="true" />

      {/* prompt */}
      <div className="psPrompt">
        <div className="psPromptText">Which one is the {promptWord.toLowerCase()}?</div>

        {/* target big image */}
        <div className="psTargetWrap">
          <div className={`psTargetGlow ${status === "correct" ? "isCorrect" : ""}`}>
          {(target?.content as any)?.imgUrl ?? (target?.content as any)?.image ? (
            <img
              src={
                (target?.content as any)?.imgUrl ??
                (target?.content as any)?.image
              }
                className="psTargetImg"
                alt={target.content.word ?? "Target"}
                draggable={false}
              />
            ) : (
              <div className="psTargetFallback" />
            )}
          </div>
        </div>
      </div>

      {/* choices */}
      <div className="psChoices">
        {choices.map((c) => {
          const isCorrect = target?.id === c.id;
          const isSelected = selectedId === c.id;

          const showCorrect =
            status === "correct" && isCorrect && isSelected;

          const showWrong =
            status === "wrong" && isSelected && !isCorrect;

          const hintPulse = hintTargetId === c.id;

          return (
            <button
              key={c.id}
              type="button"
              className={[
                "psCard",
                hintPulse ? "isHint" : "",
                showCorrect ? "isCorrect" : "",
                showWrong ? "isWrong" : "",
              ].join(" ")}
              onClick={() => handlePick(c)}
              aria-label={`Choose ${c.content?.word ?? "option"}`}
            >
              <div className="psCardInner">
                <div className="psCardImgWrap" aria-hidden="true">
                  {(c.content as any)?.imgUrl ?? (c.content as any)?.image ? (
                    <img
                      src={
                        (c.content as any)?.imgUrl ??
                        (c.content as any)?.image
                      }

                      className="psCardImg"
                      alt=""
                      draggable={false}
                    />
                  ) : (
                    <div className="psCardImgFallback" />
                  )}
                </div>

                <div className="psCardLabel">{c.content?.word ?? "Item"}</div>

                {/* feedback badge */}
                {showCorrect ? <div className="psBadge ok">✓</div> : null}
                {showWrong ? <div className="psBadge no">✕</div> : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* bottom buttons (optional: only render if you pass handlers) */}
      {(onBack || onHint) && (
        <div className="psBottom">
          <button
            type="button"
            className="psBottomBtn psBack"
            onClick={onBack}
            disabled={!onBack}
          >
            ← Back
          </button>

          <button
            type="button"
            className="psBottomBtn psHint"
            onClick={onHint}
            disabled={!onHint}
          >
            💡 Hint
          </button>
        </div>
      )}
    </div>
  );
}
