// src/runner/useLessonRunner.ts
import { useMemo, useState } from "react";
import type { LessonItem, LessonV1, UIMode } from "../engine/lessonSchema";

export type PerformanceSummary = {
  room2dTargets: number;
  room2dFound: number;
  room2dMisTaps: number;

  bubbleTotal: number;
  bubblePopped: number;

  picTotal: number;
  picCorrect: number;

  lastMode: UIMode;
};

export type Runner = {
  uiMode: UIMode;

  // overlay
  openItemById: (itemId: string, source?: { source: string; sourceId?: string }) => void;
  closeOverlay: () => void;
  overlayOpen: boolean;
  overlayItem: LessonItem | null;

  // selection/visits (generic for now)
  visitedObjectIds: Set<string>;
  markVisited: (objectId: string) => void;

  // performance tracking
  trackRoom2dMisTap: () => void;
  trackBubblePop: () => void;
  trackPicAttempt: (ok: boolean) => void;

  getPerformanceSummary: () => PerformanceSummary;
  resetPerformance: () => void;
};

export function useLessonRunner(lesson: LessonV1): Runner {
  // ---- content lookup
  const itemsById = useMemo(() => {
    const m = new Map<string, LessonItem>();
    for (const it of lesson.items) m.set(it.id, it);
    return m;
  }, [lesson]);

  // ---- overlay state
  const [overlayItemId, setOverlayItemId] = useState<string | null>(null);

  // ---- generic visited tracking (used by room2d bubbles etc.)
  const [visited, setVisited] = useState<Set<string>>(() => new Set());

  // ---- performance counters
  const [room2dMisTaps, setRoom2dMisTaps] = useState(0);
  const [bubblePopped, setBubblePopped] = useState(0);
  const [picCorrect, setPicCorrect] = useState(0);
  const [picTotal, setPicTotal] = useState(0);

  const uiMode = lesson.defaults.ui;

  const overlayItem = overlayItemId ? itemsById.get(overlayItemId) ?? null : null;

  const openItemById = (itemId: string) => {
    setOverlayItemId(itemId);
  };

  const closeOverlay = () => setOverlayItemId(null);

  const markVisited = (objectId: string) => {
    setVisited((prev) => {
      if (prev.has(objectId)) return prev;
      const next = new Set(prev);
      next.add(objectId);
      return next;
    });
  };

  // ---- performance tracking functions
  const trackRoom2dMisTap = () => setRoom2dMisTaps((v) => v + 1);
  const trackBubblePop = () => setBubblePopped((v) => v + 1);
  const trackPicAttempt = (ok: boolean) => {
    setPicTotal((v) => v + 1);
    if (ok) setPicCorrect((v) => v + 1);
  };

  const getPerformanceSummary = (): PerformanceSummary => ({
    room2dTargets: lesson.defaults.room2d?.objects.length ?? 0,
    room2dFound: visited.size,
    room2dMisTaps,

    bubbleTotal: lesson.items.filter((i) => i.type === "vocab").length,
    bubblePopped,

    picTotal,
    picCorrect,

    lastMode: lesson.defaults.ui,
  });

  const resetPerformance = () => {
    setVisited(new Set());
    setRoom2dMisTaps(0);
    setBubblePopped(0);
    setPicCorrect(0);
    setPicTotal(0);
    setOverlayItemId(null);
  };

  return {
    uiMode,

    openItemById,
    closeOverlay,
    overlayOpen: !!overlayItem,
    overlayItem,

    visitedObjectIds: visited,
    markVisited,

    trackRoom2dMisTap,
    trackBubblePop,
    trackPicAttempt,

    getPerformanceSummary,
    resetPerformance,
  };
}
