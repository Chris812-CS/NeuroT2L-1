import { useState } from "react";
import LessonPlayer from "../LessonPlayer";
import "./PreviewPage.css";

// ✅ choose ONE:

// (1) if image in src/assets:
import publishedImg from "../../public/assets/Student Portal/published.png"; // adjust path

// (2) if image in public:
// const publishedImg = "/lesson_published_bg.png";

export default function PreviewPage() {
  const [published, setPublished] = useState(false);

  // ✅ after publish: show ONLY the image (no container/top bar)
  if (published) {
    return (
      <div className="publishedOnlyRoot">
        <img className="publishedOnlyImg" src={publishedImg} alt="Lesson published" />
      </div>
    );
  }

  // ✅ before publish: normal preview UI
  return (
    <div className="previewRoot">
      <div className="previewTopBar">
        <div className="previewActions">
          <button
            className="pillBtn publish"
            type="button"
            onClick={() => {
              console.log("Publish clicked");
              setPublished(true);
            }}
          >
            Publish
          </button>
        </div>
      </div>

      <LessonPlayer />
    </div>
  );
}