import { useState } from "react";
import "./TeacherStructurePage.css";
import { useNavigate } from "react-router-dom";
import { buildLessonFromSelection, type ModeKey } from "../data/lessonRegistry";
import { setLessonSlot } from "../data/lessonSlot";

export default function TeacherStructurePage() {
  const [selected, setSelected] = useState<ModeKey[]>([]);
  const navigate = useNavigate();

  const isSelected = (m: ModeKey) => selected.includes(m);

  const toggle = (m: ModeKey) => {
    setSelected((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleNext = () => {
    if (selected.length === 0) {
      // up to you: toast/alert/UI message
      console.warn("No modes selected");
      return;
    }

    const lesson = buildLessonFromSelection(selected);
    setLessonSlot(lesson);
    navigate("/teacher/player");
  };

  const handleCancel = () => {
    // choose one:
    // navigate(-1);
    navigate("/teacher");
  };

  return (
    <div className="structureContainer">
      {/* Picture Selection */}
      <div className={`cardHitbox pic ${isSelected("picSelection") ? "selected" : ""}`}>
        <button
          type="button"
          className="cardBtn"
          onClick={() => toggle("picSelection")}
          aria-pressed={isSelected("picSelection")}
          aria-label="Toggle Picture Selection"
        />
        {isSelected("picSelection") && <div className="tickBadge">✓</div>}
      </div>

      {/* Fill in the Blanks */}
      <div className={`cardHitbox blanks ${isSelected("sentenceBuilder") ? "selected" : ""}`}>
        <button
          type="button"
          className="cardBtn"
          onClick={() => toggle("sentenceBuilder")}
          aria-pressed={isSelected("sentenceBuilder")}
          aria-label="Toggle Fill in the Blanks"
        />
        {isSelected("sentenceBuilder") && <div className="tickBadge">✓</div>}
      </div>

      {/* Floating Bubbles */}
      <div className={`cardHitbox bubbles ${isSelected("floatingBubble") ? "selected" : ""}`}>
        <button
          type="button"
          className="cardBtn"
          onClick={() => toggle("floatingBubble")}
          aria-pressed={isSelected("floatingBubble")}
          aria-label="Toggle Floating Bubbles"
        />
        {isSelected("floatingBubble") && <div className="tickBadge">✓</div>}
      </div>

      {/* Choose Objects */}
      <div className={`cardHitbox objects ${isSelected("room2d") ? "selected" : ""}`}>
        <button
          type="button"
          className="cardBtn"
          onClick={() => toggle("room2d")}
          aria-pressed={isSelected("room2d")}
          aria-label="Toggle Choose Objects"
        />
        {isSelected("room2d") && <div className="tickBadge">✓</div>}
      </div>

      {/* Cancel */}
      <button type="button" className="structureBtn cancel" onClick={handleCancel} />

      {/* Next */}
      <button type="button" className="structureBtn next" onClick={handleNext} />
    </div>
  );
}