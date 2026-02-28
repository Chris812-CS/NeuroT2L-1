import { useNavigate } from "react-router-dom";
import "./lessonEntrance.css";
import bg from "../../public/assets/Student Portal/lesson-entrance.png";

export default function LessonEntrance() {
  const navigate = useNavigate();

  return (
    <div className="entrance-container" style={{ backgroundImage: `url(${bg})` }}>
      {/* Class Lesson Button -> Demo 1 */}
      <button
        className="entrance-btn class-btn"
        onClick={() => navigate("/personalized?lesson=1")}
      />

      {/* Personalized Portal Button -> Demo 2 (or keep /personalized if you want) */}
      <button
        className="entrance-btn personal-btn"
        onClick={() => navigate("/personalized2")}
      />

      {/* Personalized Portal Button -> Demo 3 */}
      <button
        className="entrance-btn personal-btn-2"
        onClick={() => navigate("/personalized3")}
      />
    </div>
  );
}