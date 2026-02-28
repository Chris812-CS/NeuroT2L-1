import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Put the images in: public/assets/Student Portal/
import uploadImg from "../../public/assets/Student Portal/portal_to_upload.png"; // before
import uploadedImg from "../../public/assets/Student Portal/upload_content.png"; // after

export default function UploadPrototype() {
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={uploaded ? uploadedImg : uploadImg}
        alt={uploaded ? "Uploaded state" : "Upload state"}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />

      {/* 1) Upload hotspot (only in before screen) */}
      {!uploaded && (
    <button
      type="button"
      onClick={() => setUploaded(true)}
      aria-label="Select PDF to Upload"
      style={{
        position: "absolute",
        left: "39%",
        top: "66%",
        width: "24%",
        height: "8%",
        cursor: "pointer",

        // DEBUG: make it visible first
        opacity: 0,
        outline: "trasparent",
        background: "transparent",
        border: "none",
      }}
    />
      )}

      {/* 3) NEXT hotspot (only in uploaded screen) -> go Structure page */}
      {uploaded && (
        <button
          type="button"
          onClick={() => navigate("/teacher/structure")}
          aria-label="Next"
          style={{
            position: "absolute",

            // ✅ Adjust these to match the green Next button location on the uploaded screen
            left: "51%",
            top: "81%",
            width: "14%",
            height: "7%",

            opacity: 0.35,
            cursor: "pointer",
            border: "none",
            background: "transparent",
            outline: "transparent"
          }}
        />
      )}
    </div>
  );
}