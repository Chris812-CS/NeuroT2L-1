import { BrowserRouter, Routes, Route } from "react-router-dom";
import LessonEntrance from "./StudentPage/LessonEntrance";
// import ClassLessonPage from "./ClassLessonPage";
import PersonalizedPage from "./StudentPage/PersonalizedPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LessonEntrance />} />
        {/* <Route path="/class-lesson" element={<ClassLessonPage />} /> */}
        <Route path="/personalized" element={<PersonalizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;