# AI Research — Research Intelligence

A full-stack application for managing, summarizing, and querying academic research papers using AI. Built with React + Vite on the frontend and Django on the backend, powered by OpenRouter for AI processing.

---

## ✨ Features

| Feature | Description |
|---|---|
| **PDF Parsing** | Client-side extraction via pdf.js — files never leave your machine |
| **Layered Summaries** | AI generates structured output: Abstract, Methodology, Findings, Limitations |
| **Technical Insights** | Extracts objectives, key concepts, and conclusions |
| **Semantic Search** | Natural-language search across your entire document library |
| **Chat with AI** | Context-aware Q&A grounded in your uploaded papers |
| **Voice Workflow** | Speech-to-Text input and Text-to-Speech output (browser-native) |
| **Multi-Language** | Supports 7 languages for queries and responses |

---

## 🛠️ Prerequisites

- **Node.js** v18 or higher
- **Python** v3.10 or higher
- **Git**
- An **OpenRouter API Key** — get one free at [openrouter.ai](https://openrouter.ai)

---

## 🚀 Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ai-research.git
cd ai-research
```

### 2. Backend (Django)

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# .\venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and paste your OpenRouter API key

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
# Backend runs at http://127.0.0.1:8000
```

### 3. Frontend (React + Vite)

Open a **new terminal** (keep the backend running):

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Frontend runs at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
ai-research/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── Spinner.jsx         # Loading spinner
│   │   │   └── Toast.jsx           # Notification toasts
│   │   ├── pages/
│   │   │   ├── LibraryPage.jsx     # Paper collection & detail modal
│   │   │   ├── UploadPage.jsx      # Drag-and-drop PDF upload
│   │   │   ├── SearchPage.jsx      # Semantic search
│   │   │   └── ChatPage.jsx        # AI chat with voice
│   │   ├── utils/
│   │   │   ├── api.js              # Axios API wrapper
│   │   │   ├── pdfParser.js        # Client-side PDF text extraction
│   │   │   └── speech.js           # Web Speech API wrapper
│   │   ├── styles/
│   │   │   └── index.css           # Tailwind entry
│   │   ├── App.jsx                 # Root component & routing
│   │   └── main.jsx                # React entry point
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── scholara_backend/
│   │   ├── __init__.py
│   │   ├── settings.py             # Django settings
│   │   ├── urls.py                 # Root URL config
│   │   └── papers/
│   │       ├── __init__.py
│   │       ├── apps.py
│   │       ├── models.py           # Paper model
│   │       ├── views.py            # All API endpoints
│   │       ├── ai.py               # OpenRouter helper
│   │       ├── urls.py             # Papers URL routes
│   │       └── migrations/
│   │           ├── __init__.py
│   │           └── 0001_initial.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | ✓ | Your OpenRouter API key |
| `OPENROUTER_MODEL` | ✗ | Model to use (default: `openai/gpt-4o-mini`) |
| `DJANGO_SECRET_KEY` | ✗ | Change in production |

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE).
