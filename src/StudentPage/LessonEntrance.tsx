import { useNavigate } from "react-router-dom";
import "./lessonEntrance.css";
import bg from "../../public/assets/Student Portal/lesson-entrance.png";

export default function LessonEntrance() {
  const navigate = useNavigate();

  return (
    <div className="entrance-container" style={{ backgroundImage: `url(${bg})` }}>

      {/* Class Lesson Button */}
      <button
        className="entrance-btn class-btn"
        onClick={() => navigate("/class-lesson")}
      />

      {/* Personalized Portal Button */}
      <button
        className="entrance-btn personal-btn"
        onClick={() => navigate("/personalized")}
      />

    </div>
  );
}