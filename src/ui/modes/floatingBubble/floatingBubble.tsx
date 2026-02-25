import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonItem } from "../../../engine/lessonSchema";
import OverlayCard from "../../shared/OverlayCard";
import "./floatingBubble.css";

type Bubble = {
  id: string;     // bubble id
  itemId: string; // lesson item id
  x: number;      // center x (px)
  y: number;      // center y (px)
  vx: number;     // px/sec
  vy: number;     // px/sec
  size: number;   // diameter (px)
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function FloatingBubbleUI({
  items,
  onSelect,
  title = "Floating Bubble Vocabulary",
  backgroundUrl,
  foundCount = 0,
}: {
  items: LessonItem[];
  onSelect: (itemId: string, bubbleId: string) => void;

  // --- Demo/UI props (optional) ---
  title?: string;
  backgroundUrl?: string; // e.g. "/assets/rooms/classroom_toys_v1.png"
  foundCount?: number;    // pass from runner if you have it
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  const vocabItems = useMemo(
    () => items.filter((it) => it.type === "vocab"),
    [items]
  );

  const total = vocabItems.length;

  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Initialize bubbles once items are known
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const minSize = 160; // bigger like your mock
    const maxSize = 220;
    const speed = 38; // slower, calmer

    const next: Bubble[] = vocabItems.map((it, idx) => {
      const size = minSize + ((idx * 31) % (maxSize - minSize + 1));
      const r = size / 2;

      // store center positions so bubbles never clip
      const x = r + (idx * 137) % Math.max(1, W - size);
      const y = r + (idx * 97) % Math.max(1, H - size);

      // pseudo-random directions (calm drift)
      const dir = (idx % 6) * (Math.PI / 3) + Math.PI / 8;
      const vx = Math.cos(dir) * speed;
      const vy = Math.sin(dir) * speed;

      return {
        id: `bubble-${it.id}`,
        itemId: it.id,
        x,
        y,
        vx,
        vy,
        size,
      };
    });

    setBubbles(next);
    lastTsRef.current = 0;
  }, [vocabItems]);

  // Animation loop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const rect = el.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      setBubbles((prev) =>
        prev.map((b) => {
          let x = b.x + b.vx * dt;
          let y = b.y + b.vy * dt;

          let vx = b.vx;
          let vy = b.vy;

          const r = b.size / 2;

          // horizontal (center + radius)
          if (x - r <= 0) {
            x = r;
            vx = Math.abs(vx);
          } else if (x + r >= W) {
            x = W - r;
            vx = -Math.abs(vx);
          }

          // vertical (center + radius)
          if (y - r <= 0) {
            y = r;
            vy = Math.abs(vy);
          } else if (y + r >= H) {
            y = H - r;
            vy = -Math.abs(vy);
          }

          return { ...b, x, y, vx, vy };
        })
      );

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const bgStyle = backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : {};

  return (
    <div className="fbPage">
      {/* Background */}
      <div className="fbBg" style={bgStyle} />
      <div className="fbBgOverlay" />

      {/* Bubble field */}
      <div ref={containerRef} className="fbField">
        {/* subtle sparkles layer */}
        <div className="fbSparkles" aria-hidden="true" />

        {bubbles.map((b) => {
          const item = items.find((it) => it.id === b.itemId);

          const word =
            item && (item.type === "vocab" || item.type === "info")
              ? item.content?.word ?? b.itemId
              : b.itemId;

          // expects your lesson JSON includes: content.imgUrl (twemoji svg)
          const imgUrl =
            item && (item.type === "vocab" || item.type === "info")
              ? (item.content as any)?.imgUrl ??
                (item.content as any)?.image ??
                null
              : null;


          return (
            <button
              key={b.id}
              className="fbBubble"
              onClick={() => {
                onSelect(b.itemId, b.id);
              }}
              style={{
                // convert center -> top-left for CSS positioning
                left: clamp(b.x - b.size / 2, 0, 99999),
                top: clamp(b.y - b.size / 2, 0, 99999),
                width: b.size,
                height: b.size,
              }}
              aria-label={`Bubble ${word}`}
              type="button"
            >
              <div className="fbBubbleInner">
                <div className="fbBubbleIconWrap" aria-hidden="true">
                  {imgUrl ? (
                    <img
                      className="fbBubbleIcon"
                      src={imgUrl}
                      alt=""
                      draggable={false}
                    />
                  ) : (
                    <div className="fbBubbleIconFallback" />
                  )}
                </div>

                <div className="fbBubbleLabel">{word}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reuse your existing overlay */}
    </div>
  );
}
