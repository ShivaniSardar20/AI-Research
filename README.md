# AI Research

Research intelligence platform: upload, summarize, search, and chat with academic papers using AI.

## Features

- **Upload PDFs** — Client-side parsing via pdf.js
- **Auto-Summarize** — AI-powered summaries with structured insights
- **Chat Interface** — Ask questions about your papers with context-aware responses
- **Semantic Search** — Natural-language search across your library
- **Voice I/O** — Speech-to-text and text-to-speech support
- **Multi-Language** — 7 language support

## Tech Stack

**Frontend:** React 18 + Material-UI + Create React App  
**Backend:** Django 5.0 + SQLite  
**AI:** OpenRouter API

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- OpenRouter API key ([get free at openrouter.ai](https://openrouter.ai))

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# Backend: http://127.0.0.1:8000
```

### 2. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
# Frontend: http://localhost:3000
```

### 3. Configure Environment
Create `.env` in `backend/` with:
```
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/papers/upload/` | Upload and parse PDF |
| GET | `/api/papers/` | List all papers |
| GET | `/api/papers/{id}/` | Get paper details |
| POST | `/api/papers/{id}/summarize/` | Generate summary |
| POST | `/api/papers/{id}/insights/` | Extract insights |
| GET | `/api/papers/search/` | Semantic search |
| POST | `/api/papers/chat/` | Chat with paper |
| DELETE | `/api/papers/{id}/delete/` | Delete paper |

## Project Structure

```
├── frontend/               # React app (npm start)
│   ├── src/
│   │   ├── components/    # Navbar, Toast, Spinner, ChatBox
│   │   ├── pages/         # Library, Upload, Search, Chat
│   │   ├── utils/         # API, PDF parser, Speech
│   │   └── App.jsx
│   └── package.json
│
└── backend/               # Django app (python manage.py runserver)
    ├── papers/           # Models, views, API routes
    └── AI_backend/       # Settings, URLs
```

## License

MIT
