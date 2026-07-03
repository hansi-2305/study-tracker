# StudyOS — Personal Knowledge Tracker

A full-stack study notes app with streak tracking, markdown support, and organized sections.

## Stack
- **Frontend**: React + Vite + React Router + React Markdown
- **Backend**: FastAPI (Python) with JSON file storage

## Project Structure
```
study-tracker/
├── backend/
│   ├── main.py          # FastAPI app (all routes)
│   ├── requirements.txt
│   └── notes_data.json  # auto-created on first run
├── frontend/
│   └── src/
│       ├── pages/       # Home, SectionPage, NoteDetail, NewNote, EditNote
│       ├── components/  # Layout, NoteEditor
│       └── utils/       # api.js, sections.js
├── start-backend.sh
└── start-frontend.sh
```

## Setup & Run

### Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Features

### Sections
- **DSA** — Data Structures & Algorithms
- **OS** — Operating Systems
- **OOPS** — Object Oriented Programming
- **Computer Networks** — CN concepts
- **System Design** — Architecture & design

### Notes
- Write notes in **Markdown** with live preview
- Add **tags** to organize notes
- Notes sorted by **date** (newest first)
- **Pagination** — 5 notes per page
- **Search** within each section
- Full **CRUD** — create, read, edit, delete

### Streak
- 🔥 Daily streak tracked automatically
- Writing any note today counts toward your streak
- Current streak + longest streak shown in sidebar

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /notes | List notes (section, page, search) |
| POST | /notes | Create note |
| GET | /notes/{id} | Get note |
| PUT | /notes/{id} | Update note |
| DELETE | /notes/{id} | Delete note |
| GET | /streak | Get streak info |
| GET | /stats | Dashboard stats |
| GET | /sections | List all sections |

## Extending
- Swap `notes_data.json` for SQLite/PostgreSQL by replacing `load_data()`/`save_data()` with SQLAlchemy
- Add user auth with FastAPI's OAuth2/JWT support
- Deploy backend to Railway/Render, frontend to Vercel/Netlify
