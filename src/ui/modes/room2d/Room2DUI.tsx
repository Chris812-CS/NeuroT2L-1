import { useLayoutEffect, useRef, useState, useEffect} from "react";
import type { Room2DConfig } from "../../../engine/lessonSchema";
import "./Room2DUI.css";

type Rect = { left: number; top: number; width: number; height: number };

const IDLE_HINT_MS = 5000;
const MISTAP_HINT_COUNT = 2;

export default function Room2DUI({
  config,
  onSelect,
  onMisTap,
  visited,
  hintHighlightObjectId,
  hintForceShow,
}: {
  config: Room2DConfig;
  onSelect: (itemId: string, objectId: string) => void;
  onMisTap: () => void;
  visited: Set<string>;
  hintHighlightObjectId?: string | null;
  hintForceShow?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [paintRect, setPaintRect] = useState<Rect | null>(null);

  const computePaintRect = () => {
    const stage = stageRef.current;
    if (!stage || !natural) return;

    const s = stage.getBoundingClientRect();
    const stageW = s.width;
    const stageH = s.height;

    // object-fit: contain math
    const scale = Math.min(stageW / natural.w, stageH / natural.h);
    const drawnW = natural.w * scale;
    const drawnH = natural.h * scale;

    const left = (stageW - drawnW) / 2;
    const top = (stageH - drawnH) / 2;

    setPaintRect({ left, top, width: drawnW, height: drawnH });
  };

  useLayoutEffect(() => {
    computePaintRect();
    const ro = new ResizeObserver(() => computePaintRect());
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", computePaintRect);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computePaintRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [natural, config.background]);

  const [misTapCount, setMisTapCount] = useState(0);
  const [glowActive, setGlowActive] = useState(false);
  const interactionTickRef = useRef(0);

  const bumpInteraction = () => {
    interactionTickRef.current += 1;
  };

  // Reset hint whenever the hinted object changes or background changes
  useEffect(() => {
    setGlowActive(false);
    setMisTapCount(0);
    bumpInteraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hintHighlightObjectId, config.background]);

  // Idle timer -> enable glow (only if a target exists and paintRect exists)
  useEffect(() => {
    if (!hintHighlightObjectId) {
      setGlowActive(false);
      return;
    }
    if (!paintRect) return;

    const startTick = interactionTickRef.current;

    const t = window.setTimeout(() => {
      if (interactionTickRef.current === startTick) setGlowActive(true);
    }, IDLE_HINT_MS);

    return () => window.clearTimeout(t);
  }, [hintHighlightObjectId, paintRect, misTapCount]);

  // Mistap escalation
  useEffect(() => {
    if (!hintHighlightObjectId) return;
    if (misTapCount >= MISTAP_HINT_COUNT) setGlowActive(true);
  }, [misTapCount, hintHighlightObjectId]);


  return (
    <div
      className="room2dWrap"
      onClick={() => {
        bumpInteraction();
        setGlowActive(false);
        setMisTapCount((c) => c + 1);
        onMisTap();
      }}
    >
      <div className="room2dStage" ref={stageRef}>
        <img
          ref={imgRef}
          className="room2dImg"
          src={config.background}
          alt="Room background"
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
            // compute after natural sizes are known
            requestAnimationFrame(() => computePaintRect());
          }}
        />

        {/* Hotspot layer matches the *painted* (contain) image rect */}
        {paintRect && (
          <div
            className="room2dHotspotLayer"
            style={{
              left: paintRect.left,
              top: paintRect.top,
              width: paintRect.width,
              height: paintRect.height,
            }}
          >
            {config.objects.map((o) => {
              const isVisited = visited.has(o.id);
              const isHinted = hintHighlightObjectId === o.id;

              return (
              <div key={o.id} className="room2dHotspotPair">
                {isHinted && (glowActive || hintForceShow) && (
                  <div
                    key={`${o.id}-glow`}
                    className="room2dGlow"
                    aria-hidden="true"
                    style={{
                      left: `${o.x}%`,
                      top: `${o.y}%`,
                      width: `${o.w}%`,
                      height: `${o.h}%`,
                    }}
                  />
                )}

                <button
                  key={o.id}
                  type="button"
                  className={[
                    "room2dHotspot",
                    isVisited ? "isVisited" : "",
                    isHinted ? "isHinted" : "",
                  ].join(" ")}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    bumpInteraction();
                    setGlowActive(false);
                    setMisTapCount(0);
                    onSelect(o.itemId, o.id);
                  }}
                  aria-label={o.label ?? o.id}
                  style={{
                    left: `${o.x}%`,
                    top: `${o.y}%`,
                    width: `${o.w}%`,
                    height: `${o.h}%`,
                  }}
                />
              </div>
            );

            })}
          </div>
        )}
      </div>
    </div>
  );
}
