// src\ui\modes\room2d\SideFlashcard.tsx
import "./SideFlashcard.css";

export type SideFlashcardModel = {
  id: string;
  word: string;
  imgUrl?: string | null;
};

export default function SideFlashcard({
  item,
  compact = true,
  variant = "default",
}: {
  item: SideFlashcardModel;
  compact?: boolean;
  variant?: "default" | "overlay";
}) {
  return (
    <div
      className={[
        "sideFlashcard",
        compact ? "isCompact" : "",
        variant === "overlay" ? "isOverlay" : "",
      ].join(" ")}
    >
      <div className="sideFlashcardMedia" aria-hidden="true">
        {item.imgUrl ? (
          <img
            className="sideFlashcardImg"
            src={item.imgUrl}
            alt=""
            draggable={false}
          />
        ) : (
          <div className="sideFlashcardImgPlaceholder" />
        )}
      </div>

      <div className="sideFlashcardText">
        <div className="sideFlashcardWord">{item.word}</div>
      </div>
    </div>
  );
}
