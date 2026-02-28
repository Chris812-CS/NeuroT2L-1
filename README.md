# NeuroT2L Prototype (MVP)

NeuroT2L is a web-based adaptive learning prototype designed for neurodiverse education.  
This MVP demonstrates two core flows:
1) Teacher uploads content to create a class lesson  
2) Student accesses class lessons and learning activities from the student portal

---

## Key Routes (Prototype Navigation)

### Student Portal
- **`/`** — Student Portal (entry point)
  - Access class lessons
  - Start lesson activities (e.g., object exploration, bubble revision, picture selection, sentence builder)

### Teacher Portal
- **`/teacher/upload`** — Teacher lesson creation page
  - Upload lesson materials (e.g., PDF/content)
  - Select lesson structure
  - Preview and publish to Class Portal

---

## Tech Overview (Prototype)
- **Frontend:** React + TypeScript (Vite)
- **Backend/AI (if enabled):** Google AI Studio (Gemini) for generating personalized lesson JSON
- **Database (if enabled):** Firebase for storing lesson content and student performance

> Note: This is a prototype/MVP for demo purposes. Some integrations may be mocked depending on the build.
