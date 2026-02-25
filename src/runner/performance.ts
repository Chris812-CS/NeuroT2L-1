export type UIModeExtended =
  | "room2d"
  | "floatingBubble"
  | "picSelection"
  | "sentenceBuilder"
  | "flashcard";

export type PerformanceSummary = {
  // ---------- RAW UI METRICS ----------
  // Room2D (Recognition)
  room2dTargets: number;
  room2dFound: number;
  room2dMisTaps: number;

  // Floating Bubble (Recall)
  bubbleTotal: number;
  bubblePopped: number;

  // Picture Selection (Discrimination)
  picTotal: number;
  picCorrect: number;

  // Sentence Builder (Production)
  sentenceTotal: number;
  sentenceCorrect: number;

  // ---------- DERIVED LEARNING METRICS ----------
  recognitionAccuracy: number;       // room2dFound / room2dTargets
  recallAccuracy: number;            // bubblePopped / bubbleTotal
  discriminationAccuracy: number;    // picCorrect / picTotal
  productionAccuracy: number;        // sentenceCorrect / sentenceTotal

  frustrationScore: number;          // computed from misTaps + wrong attempts

  // ---------- SESSION STATE ----------
  attempts: number;
  lastMode: UIModeExtended;
};
