// src\ui\LessonScaffold\LessonScaffold.tsx
import "./LessonScaffold.css";

type Props = {
  title: string;
  progressText?: string;

  // Back is now treated as Finish (label + aria), but keeps same prop name for minimal changes.
  onBack?: () => void;
  onSettings?: () => void;

  onHint?: () => void;
  onNext?: () => void;

  children: React.ReactNode;
};

export default function LessonScaffold({
  title,
  progressText,
  onBack,
  onSettings,
  onHint,
  onNext,
  children,
}: Props) {
  return (
    <div className="lessonShell">
      <header className="lessonHeader">
        <button
          type="button"
          className="lessonIconBtn"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Finish"
          title="Finish"
        >
          ✓
        </button>

        <div className="lessonTitle" title={title}>
          {title}
        </div>

        <div className="lessonHeaderRight">
          {progressText ? <div className="lessonPill">{progressText}</div> : null}

          <button
            type="button"
            className="lessonIconBtn"
            onClick={onSettings}
            disabled={!onSettings}
            aria-label="Settings"
            title="Settings"
          >
            ⚙
          </button>
        </div>
      </header>

      <main className="lessonContent">
        <div className="lessonContentInner">{children}</div>
      </main>

      <footer className="lessonFooter">
        <button
          type="button"
          className="lessonNavBtn"
          onClick={onBack}
          disabled={!onBack}
        >
          Finish
        </button>

        <button
          type="button"
          className="lessonNavBtn primary"
          onClick={onHint}
          disabled={!onHint}
        >
          Hint
        </button>

        <button type="button" className="lessonNavBtn" onClick={onNext}>
          Next
        </button>
      </footer>
    </div>
  );
}
