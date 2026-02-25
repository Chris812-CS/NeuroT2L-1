// src/engine/lessonSchema.ts
export type UIMode =
  | "flashcard"
  | "room2d"
  | "floatingBubble"
  | "picSelection"
  | "sentenceBuilder";


export type LessonFeatures = {
  tts: boolean;
  speech: boolean;
  picSelection: boolean;
};

export type Room2DObject = {
  id: string;
  itemId: string;
  x: number; // 0-100
  y: number; // 0-100
  w: number; // 0-100
  h: number; // 0-100
  label?: string;
  hint?: boolean;
  activeOrder?: number;
};

export type Room2DConfig = {
  background: string;
  objects: Room2DObject[];
  hintMode?: "highlight-on-start" | "after-delay" | "always";
  hintDurationMs?: number;
  hintDelayMs?: number;
  sequenceMode?: "one-active-at-a-time";
};

export type LessonItemBase = {
  id: string;
  type: "info" | "vocab" | "scene";
  ui?: UIMode; // optional per-item override
  content?: Record<string, unknown>;
};

export type VocabItem = LessonItemBase & {
  type: "vocab";
  content: { word: string; image?: string };
};

export type InfoItem = LessonItemBase & {
  type: "info";
  content: { word: string; image?: string };
};

export type SceneItem = LessonItemBase & {
  type: "scene";
  content: { room2d?: Room2DConfig };
};

export type PicSelectionConfig = {
  questions: number;
  choicesPerQuestion: number;
  ttsOnPrompt?: boolean;
  includeWordLabel?: boolean;
};

export type LessonItem = VocabItem | InfoItem | SceneItem;

export type LessonV1 = {
  lessonId: string;
  version: 1;
  title: string;
  defaults: LessonDefaults;
  items: LessonItem[];
  content?: {
    picSelection?: PicSelectionConfig;
  };
};

export type SentenceBuilderConfig = {
  background?: string;
  tokens: Array<
    | { kind: "text"; value: string }
    | { kind: "blank"; id: string; placeholder?: string }
  >;
  wordBank: string[];
  answers?: Record<string, string>;
};

export type LessonDefaults = {
  ui: "room2d" | "floatingBubble" | "picSelection" | "flashcard" | "sentenceBuilder" ;
  features?: any;
  room2d?: any;
  sentenceBuilder?: SentenceBuilderConfig;
  // ...other modes
};

