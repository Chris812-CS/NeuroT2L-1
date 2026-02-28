import { BrowserRouter, Routes, Route } from "react-router-dom";

import LessonEntrance from "./StudentPage/LessonEntrance";
import PersonalizedPage from "./StudentPage/PersonalizedPage";
import TeacherStructurePage from "./TeacherPage/TeacherStructurePage";
import TeacherUploadContentPage from "./TeacherPage/UploadPrototype";
import PreviewPage from "./TeacherPage/PreviewPage";
import PersonalizedPage2 from "./StudentPage/PersonalizedPage2";
import PersonalizedPage3 from "./StudentPage/PersonalizedPage3";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student */}
        <Route path="/" element={<LessonEntrance />} />
        <Route path="/personalized" element={<PersonalizedPage />} />
        <Route path="/personalized2" element={<PersonalizedPage2 />} />
        <Route path="/personalized3" element={<PersonalizedPage3 />} />

        {/* Teacher */}
        <Route path="/teacher/structure" element={<TeacherStructurePage />} />
        <Route path="/teacher/upload" element={<TeacherUploadContentPage />} />
        <Route path="/teacher/player" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;