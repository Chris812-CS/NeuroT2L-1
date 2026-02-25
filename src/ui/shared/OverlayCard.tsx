// src/ui/shared/OverlayCard.tsx
import { useEffect, useRef } from "react";
import type { LessonItem } from "../../engine/lessonSchema";
import { speak } from "../../features/tts/tts";
import SideFlashcard from "../modes/room2d/SideFlashcard";
import "./OverlayCard.css";

export default function OverlayCard({
  item,
  onClose,
}: {
  item: LessonItem;
  onClose: () => void;
}) {
  const playedRef = useRef(false);

  const word =
    item.type === "vocab" || item.type === "info"
      ? item.content?.word
      : undefined;

  const imgUrl =
    item && (item.type === "vocab" || item.type === "info")
      ? (item.content as any)?.imgUrl ??
        (item.content as any)?.image ??
        null
      : null;


  useEffect(() => {
    playedRef.current = false;
  }, [item.id]);

  useEffect(() => {
    if (item.type !== "vocab") return;
    if (!word) return;
    if (playedRef.current) return;
    playedRef.current = true;
    speak(word);
  }, [item.type, word]);

  return (
    <div className="overlayBackdrop" onClick={onClose}>
      <div className="overlayPanel" onClick={(e) => e.stopPropagation()}>
        <div className="overlayContent">
          <SideFlashcard
            item={{ id: "overlay", word: word ?? "—", imgUrl }}
            compact={false}
            variant="overlay"
          />
        </div>

        <div className="overlayActions">
          <button className="overlayBtn" onClick={() => word && speak(word)} type="button">
            Replay
          </button>
          <button className="overlayBtn" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
