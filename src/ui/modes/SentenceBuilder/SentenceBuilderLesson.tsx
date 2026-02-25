import React, { useMemo, useState } from "react";
import "./SentenceBuilderLesson.css";

export type SentenceToken =
  | { kind: "text"; value: string }
  | { kind: "blank"; id: string; placeholder?: string };

type Props = {
  tokens: SentenceToken[];
  wordBank: string[];
  answers?: Record<string, string>;

  // NEW: optional background image (same style as picSelection)
  backgroundUrl?: string;

  onSubmitResult?: (payload: {
    filled: Record<string, string | null>;
    isCorrect: boolean | null;
    perBlank?: Record<string, boolean>;
  }) => void;
};

type DragPayload =
  | { from: "bank"; word: string }
  | { from: "blank"; blankId: string; word: string };

export default function SentenceBuilderLesson({
  tokens,
  wordBank,
  answers,
  backgroundUrl,
  onSubmitResult,
}: Props) {
  const blankIds = useMemo(
    () => tokens.filter((t) => t.kind === "blank").map((t) => (t as any).id as string),
    [tokens]
  );

  const [filled, setFilled] = useState<Record<string, string | null>>(() => {
    const init: Record<string, string | null> = {};
    blankIds.forEach((id) => (init[id] = null));
    return init;
  });

  const computedBank = useMemo(() => {
    const used = new Set(Object.values(filled).filter(Boolean) as string[]);
    return wordBank.filter((w) => !used.has(w));
  }, [wordBank, filled]);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const allFilled = blankIds.every((id) => !!filled[id]);

  function reset() {
    const init: Record<string, string | null> = {};
    blankIds.forEach((id) => (init[id] = null));
    setFilled(init);
    setSelectedWord(null);
  }

  function packDrag(p: DragPayload) {
    return JSON.stringify(p);
  }

  function unpackDrag(raw: string): DragPayload | null {
    try {
      const obj = JSON.parse(raw);
      if (obj?.from === "bank" && typeof obj.word === "string") return obj;
      if (
        obj?.from === "blank" &&
        typeof obj.word === "string" &&
        typeof obj.blankId === "string"
      )
        return obj;
      return null;
    } catch {
      return null;
    }
  }

  function placeWord(targetBlankId: string, word: string, from?: DragPayload) {
    setFilled((prev) => {
      const next = { ...prev };

      // If word is already used elsewhere, remove it there first
      const usedIn = Object.entries(next).find(([bid, w]) => w === word && bid !== targetBlankId);
      if (usedIn) next[usedIn[0]] = null;

      const targetPrev = next[targetBlankId];
      next[targetBlankId] = word;

      // If dragging from another blank, swap/move
      if (from?.from === "blank") {
        if (from.blankId !== targetBlankId) {
          next[from.blankId] = targetPrev ?? null;
        }
      }

      return next;
    });
  }

  function clearBlank(blankId: string) {
    setFilled((prev) => ({ ...prev, [blankId]: null }));
  }

  function handleSubmit() {
    if (!answers) {
      onSubmitResult?.({ filled, isCorrect: null });
      return;
    }

    const perBlank: Record<string, boolean> = {};
    let ok = true;

    for (const id of blankIds) {
      const expected = answers[id];
      const got = filled[id];
      const isBlankCorrect = !!expected && got === expected;
      perBlank[id] = isBlankCorrect;
      if (!isBlankCorrect) ok = false;
    }

    onSubmitResult?.({ filled, isCorrect: ok, perBlank });
  }

  return (
    <div className="sbPage">
      {/* background layer (like PictureSelection) */}
      <div
        className="sbBg"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
      />
      <div className="sbBgOverlay" />
      <div className="sbSparkles" aria-hidden="true" />

      {/* foreground content */}
      <div className="sbWrap">
        {/* Top banner */}
        <div className="sbHero">
          <div className="sbHeroLeft">
            <div className="sbH1">Build the Sentence</div>
            <div className="sbSub">Drag the word(s) into the blank box.</div>
          </div>

          <div className="sbHeroRight">
            <div className="sbBubble">
              <div className="sbBubbleLabel">Make a sentence:</div>
              <div className="sbBubbleText">Complete the sentence below</div>
            </div>

            <div className="sbOwl" aria-hidden="true">
            <img className="sbOwlImg" src="/assets/Owl/Owl.png" alt="" />
            </div>

          </div>
        </div>

        {/* Arrange section */}
        <div className="sbCard sbCardLarge">
          <div className="sbCardTitle">Arrange the sentence:</div>

          <div className="sbSentenceLine sbSentenceLineLarge" role="group" aria-label="Sentence builder">
            {tokens.map((t, idx) => {
              if (t.kind === "text") {
                return (
                  <span key={`t-${idx}`} className="sbText sbTextLarge">
                    {(t.value || "").replace(/\s+/g, " ")}
                  </span>
                );
              }

              const blankId = t.id;
              const word = filled[blankId];

              return (
                <div
                  key={`b-${blankId}`}
                  className={`sbBlank sbBlankLarge ${word ? "filled" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const payload = unpackDrag(e.dataTransfer.getData("text/plain"));
                    if (!payload) return;
                    placeWord(blankId, payload.word, payload);
                    setSelectedWord(null);
                  }}
                  onClick={() => {
                    if (word) {
                      clearBlank(blankId);
                      return;
                    }
                    if (selectedWord) {
                      placeWord(blankId, selectedWord, { from: "bank", word: selectedWord });
                      setSelectedWord(null);
                    }
                  }}
                  aria-label={word ? `Blank filled with ${word}` : "Empty blank"}
                  title={word ? "Click to remove" : selectedWord ? "Click to place selected word" : ""}
                >
                  {word ? (
                    <div
                      className="sbBlankWord"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "text/plain",
                          packDrag({ from: "blank", blankId, word })
                        );
                        e.dataTransfer.effectAllowed = "move";
                      }}
                    >
                      {word}
                    </div>
                  ) : (
                    <div className="sbBlankPlaceholder">{t.placeholder ?? "_____"}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Word bank + actions */}
        <div className="sbCard sbCardWide">
          <div className="sbCardTitle">Word Bank:</div>

          <div className="sbBank" role="list" aria-label="Word bank">
            {computedBank.map((w) => {
              const isSelected = selectedWord === w;
              return (
                <button
                  key={w}
                  type="button"
                  className={`sbChip ${isSelected ? "selected" : ""}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", packDrag({ from: "bank", word: w }));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onClick={() => setSelectedWord((prev) => (prev === w ? null : w))}
                  role="listitem"
                  aria-label={`Word ${w}`}
                  title="Drag to a blank (or click to select)"
                >
                  {w}
                </button>
              );
            })}
          </div>

          <div className="sbActionsRow sbActionsRowWide">
            <button type="button" className="sbBtn reset" onClick={reset}>
              RESET
            </button>

            <button
              type="button"
              className="sbBtn submit"
              onClick={handleSubmit}
              disabled={!allFilled}
              title={!allFilled ? "Fill all blanks first" : "Submit your sentence"}
            >
              SUBMIT
            </button>
          </div>

          {selectedWord ? (
            <div className="sbHint">
              Selected: <b>{selectedWord}</b> → click an empty blank to place it.
            </div>
          ) : (
            <div className="sbHint">Tip: Drag words into the blank(s), or tap a word then tap a blank.</div>
          )}
        </div>
      </div>
    </div>
  );
}
