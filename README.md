# AI Research

AI research workspace for uploading papers, generating summaries, extracting insights, searching your library, and chatting with documents.

## Open Links

- Frontend deploy link: `https://your-netlify-site.netlify.app`
- Backend API: `https://your-render-service.onrender.com/api`
- Backend health check: `https://your-render-service.onrender.com/health/`
- GitHub repository: `https://github.com/ShivaniSardar20/AI-Research`

Replace the placeholder Netlify and Render URLs with your real deployed links.

## Responsive Use

The frontend is designed to open on:

- desktop browsers
- laptop browsers
- tablet browsers
- mobile browsers

## Local Run

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open: `http://127.0.0.1:8000/health/`

### Frontend

```bash
cd frontend
npm install
npm start
```

Open: `http://localhost:3000`

## Deploy

### Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `build`
- Env var: `REACT_APP_API_BASE_URL=https://your-render-service.onrender.com/api`

### Render

- Root directory: `backend`
- Build command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
- Start command: `gunicorn AI_backend.wsgi:application`

Render env vars:

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

## Important Files

- [netlify.toml](./netlify.toml)
- [render.yaml](./render.yaml)
- [frontend/.env.example](./frontend/.env.example)
- [backend/.env.example](./backend/.env.example)
