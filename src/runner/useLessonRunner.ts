import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonV1, UIMode } from "../engine/lessonSchema";

export type Runner = {
  uiMode: UIMode;
  goNext: () => void;
  availableModes: UIMode[];

  hintHighlightObjectId: string | null;
  hintForceShow: boolean;
  requestHint: () => void;
  clearHintForce: () => void;

  visitedObjectIds: Set<string>;
  markVisited: (id: string) => void;
  trackRoom2dMisTap: () => void;

  getPerformanceJSON: () => any;
  downloadPerformance: () => void;

  getPerformanceSummary: () => {
    room2dFound: number;
    room2dTargets: number;
    room2dMisTaps: number;

    bubblePopped: number;
    bubbleTotal: number;

    picCorrect: number;
    picTotal: number;

    sentenceCorrect: number;
    attempts: number;
  };

  overlayOpen: boolean;
  overlayItem: any;
  closeOverlay: () => void;
  openItemById: (id: string, meta?: any) => void;

  trackBubblePop: () => void;
  trackPicAttempt: (ok: boolean) => void;
  trackSentenceAttempt: (ok: boolean) => void;
};

const MISTAPS_TO_FORCE_HINT = 2;

export function useLessonRunner(lesson: LessonV1): Runner {
  const availableModes = useMemo<UIMode[]>(() => {
    const modes: UIMode[] = [];
    if (lesson.defaults.room2d) modes.push("room2d");
    if (lesson.items?.length) modes.push("floatingBubble");
    if (lesson.content?.picSelection) modes.push("picSelection");
    if (lesson.defaults.sentenceBuilder) modes.push("sentenceBuilder");
    if (modes.length === 0) modes.push(lesson.defaults.ui);
    return modes;
  }, [lesson]);

  const [uiMode, setUiMode] = useState<UIMode>(
    availableModes[0] ?? lesson.defaults.ui
  );

  useEffect(() => {
    if (!availableModes.includes(uiMode)) {
      setUiMode(availableModes[0]);
    }
  }, [availableModes, uiMode]);

  const goNext = () => {
    if (availableModes.length <= 1) return;
    setUiMode((cur) => {
      const idx = availableModes.indexOf(cur);
      return availableModes[(idx + 1) % availableModes.length];
    });
  };

  // ---------------- COUNTERS ----------------
  const [bubblePopped, setBubblePopped] = useState(0);
  const [picCorrect, setPicCorrect] = useState(0);
  const [sentenceCorrect, setSentenceCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // ---------------- VISITED ----------------
  const visitedRef = useRef<Set<string>>(new Set());
  const [visitedTick, setVisitedTick] = useState(0);

  const markVisited = (id: string) => {
    if (!visitedRef.current.has(id)) {
      visitedRef.current.add(id);
      setVisitedTick((t) => t + 1);
      setAttempts((c) => c + 1);
    }
  };

  const trackBubblePop = () => {
    setBubblePopped((c) => c + 1);
    setAttempts((c) => c + 1);
  };

  const trackPicAttempt = (ok: boolean) => {
    if (ok) setPicCorrect((c) => c + 1);
    setAttempts((c) => c + 1);
  };

  const trackSentenceAttempt = (ok: boolean) => {
    if (ok) setSentenceCorrect((c) => c + 1);
    setAttempts((c) => c + 1);
  };

  // ---------------- OVERLAY ----------------
  const [overlayItem, setOverlayItem] = useState<any>(null);

  const openItemById = (id: string, meta?: any) => {
    console.log("Opening overlay:", id, meta);

    const item = lesson.items.find((it) => it.id === id);
    if (!item) {
      console.warn("Item not found:", id);
      return;
    }
    setOverlayItem(item);
  };

  const closeOverlay = () => setOverlayItem(null);
  const overlayOpen = !!overlayItem;

  // ---------------- ADAPTIVE HINT ----------------
  const [hintHighlightObjectId, setHintHighlightObjectId] =
    useState<string | null>(null);
  const [hintForceShow, setHintForceShow] = useState(false);
  const [room2dMisTaps, setRoom2dMisTaps] = useState(0);

  const pickNextRoom2dTarget = () => {
    const cfg = lesson.defaults.room2d;
    if (!cfg?.objects?.length) return null;

    const objs = [...cfg.objects];
    objs.sort((a, b) => (a.activeOrder ?? 9999) - (b.activeOrder ?? 9999));

    const next = objs.find((o) => !visitedRef.current.has(o.id));
    return next?.id ?? null;
  };

  useEffect(() => {
    if (uiMode !== "room2d") return;

    const nextId = pickNextRoom2dTarget();
    setHintHighlightObjectId(nextId);
    setHintForceShow(false);
    setRoom2dMisTaps(0);
  }, [uiMode, lesson, visitedTick]);

  const requestHint = () => {
    if (uiMode !== "room2d") return;
    setHintForceShow(true);
  };

  const clearHintForce = () => setHintForceShow(false);

  const trackRoom2dMisTap = () => {
    if (uiMode !== "room2d") return;

    setRoom2dMisTaps((c) => {
      const next = c + 1;
      if (next >= MISTAPS_TO_FORCE_HINT) setHintForceShow(true);
      return next;
    });

    setAttempts((c) => c + 1);
  };

  // ---------------- PERFORMANCE ----------------
  const getPerformanceSummary = () => {
    const room2dTargets = lesson.defaults.room2d?.objects?.length ?? 0;

    const room2dFound = lesson.defaults.room2d
      ? lesson.defaults.room2d.objects.filter((o) => visitedRef.current.has(o.id))
          .length
      : 0;

    // picSelection total: prefer array length if questions is an array
    const picTotal =
      Array.isArray(lesson.content?.picSelection?.questions)
        ? lesson.content.picSelection.questions.length
        : (lesson.content?.picSelection?.questions as number) ?? 0;

    return {
      room2dFound,
      room2dTargets,
      room2dMisTaps,

      bubblePopped,
      bubbleTotal: lesson.items?.length ?? 0,

      picCorrect,
      picTotal,

      sentenceCorrect,
      attempts,
    };
  };

  const getPerformanceJSON = () => {
    const summary = getPerformanceSummary();
    return {
      lessonId: lesson.lessonId,
      timestamp: new Date().toISOString(),
      ...summary,
    };
  };

  const downloadPerformance = () => {
    const data = getPerformanceJSON();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lesson.lessonId}-performance.json`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return {
    uiMode,
    goNext,
    availableModes,

    hintHighlightObjectId,
    hintForceShow,
    requestHint,
    clearHintForce,

    visitedObjectIds: visitedRef.current,
    markVisited,
    trackRoom2dMisTap,

    getPerformanceSummary,
    getPerformanceJSON,
    downloadPerformance,

    overlayOpen,
    overlayItem,
    closeOverlay,
    openItemById,

    trackBubblePop,
    trackPicAttempt,
    trackSentenceAttempt,
  };
}
