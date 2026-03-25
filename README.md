# AI Research

Research intelligence platform for uploading, summarizing, searching, and chatting with academic papers.

## Features

- Upload PDFs with client-side parsing via `pdf.js`
- Generate AI summaries and structured insights
- Ask questions against stored research papers
- Search papers with natural language
- Use voice input/output and multilingual flows

## Tech Stack

- Frontend: React 18, Material UI, Create React App
- Backend: Django 5, SQLite
- AI: OpenRouter API

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- An OpenRouter API key

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

Create `backend/.env` with:

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

Create `frontend/.env.local` with:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```

If `REACT_APP_API_BASE_URL` is not set, the frontend falls back to `/api`, which is suitable for local proxy-based development.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/papers/upload/` | Upload and parse PDF |
| GET | `/api/papers/` | List all papers |
| GET | `/api/papers/{id}/` | Get paper details |
| POST | `/api/papers/{id}/summarize/` | Generate summary |
| POST | `/api/papers/{id}/insights/` | Extract insights |
| GET | `/api/papers/search/` | Semantic search |
| POST | `/api/papers/chat/` | Chat with paper |
| DELETE | `/api/papers/{id}/delete/` | Delete paper |

## Project Structure

```text
frontend/
  src/
    components/
    contexts/
    pages/
    styles/
    utils/
  package.json

backend/
  AI_backend/
  papers/
  manage.py
  requirements.txt
```

## GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

If the repository is already initialized, use the existing remote and just run `git add`, `git commit`, and `git push`.

## Netlify Frontend Deploy

This repo includes a root [netlify.toml](./netlify.toml) configured for the React frontend:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `build`

Set this environment variable in Netlify:

```env
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
```

Important deployment note:

- Netlify should host the frontend only.
- Django must be deployed separately on a Python-capable platform such as Render, Railway, or PythonAnywhere.
- After the backend is live, set `REACT_APP_API_BASE_URL` in Netlify to the deployed backend URL.

## Render Backend Deploy

This repo also includes a root [render.yaml](./render.yaml) for the Django API.

Backend environment variables you should set in Render:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
DJANGO_SECRET_KEY=replace-with-a-strong-secret
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-render-service.onrender.com
CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
CSRF_TRUSTED_ORIGINS=https://your-netlify-site.netlify.app
DATABASE_URL=postgres://...
```

Notes:

- `gunicorn` is configured as the backend web server.
- `/health/` is available for health checks.
- If you use Render Postgres, set `DATABASE_URL` from the Render database service.
- After the backend URL is live, set the same URL in Netlify as `REACT_APP_API_BASE_URL=https://your-render-service.onrender.com/api`.

## License

MIT
