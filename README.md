# news.avild.com

Security News & Threat Intelligence Platform — FastAPI backend, Nginx frontend, PostgreSQL database.

---

## Architecture

| Service  | Technology      | Role                                      |
| -------- | --------------- | ----------------------------------------- |
| Frontend | Nginx           | Serves static HTML pages + CSS/JS assets  |
| Backend  | FastAPI (Python)| REST API for news data                    |
| Database | PostgreSQL 16   | Stores news articles                      |

Nginx proxies `/api/` requests to the FastAPI backend and serves all HTML pages directly as static files.

---

## Prerequisites

Git, Docker Desktop, and Python 3.13 are required. Run the script for your OS to install them all at once:

**Windows** (PowerShell as Administrator):

```powershell
Set-ExecutionPolicy Bypass -Scope Process; .\install-prereqs.ps1
```

**macOS / Linux**:

```bash
bash install-prereqs.sh
```

The scripts skip anything that's already installed. After running, **restart your machine** before continuing (Docker Desktop needs it on Windows).

---

## Running the Full Stack (Docker)

```bash
cp .env.example .env
docker compose up --build
```

This builds and starts all three services. The site is available at <http://localhost>

To stop:

```bash
docker compose down
```

---

## Local Dev (Backend Only)

For backend development without Docker:

### 1. Clone the repo

```bash
git clone https://github.com/OmarHackerPro/kiber.git
cd kiber
```

### 2. Create a virtual environment and install dependencies

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Set up your environment file

```bash
cp .env.example .env
```

### 4. Start the database

```bash
docker compose up -d db
```

### 5. Run database migrations

```bash
alembic upgrade head
```

### 6. Start the dev server

```bash
uvicorn main:app --reload
```

API available at <http://localhost:8000>

---

## Key URLs

| URL                              | Description                       |
| -------------------------------- | --------------------------------- |
| <http://localhost/>              | Home page                         |
| <http://localhost/category>      | Category / topic page             |
| <http://localhost/search>        | Search                            |
| <http://localhost/entity>        | Threat actor / entity page        |
| <http://localhost/preferences>   | My Stack — source preferences     |
| <http://localhost/rss-config>    | RSS feed configuration            |
| <http://localhost/webhooks>      | Webhook settings                  |
| <http://localhost/api/news/>     | News feed (JSON)                  |
| <http://localhost/api/news/{id}> | Single news item by ID            |
| <http://localhost:8000/docs>     | Swagger UI (backend dev only)     |
| <http://localhost:8000/redoc>    | ReDoc (backend dev only)          |

---

## Project Structure

```text
kiber/
├── main.py                  # FastAPI app entry point
├── requirements.txt
├── docker-compose.yml       # Full stack: frontend + backend + db
├── Dockerfile.backend       # FastAPI container
├── Dockerfile.frontend      # Nginx container (serves static HTML)
├── install-prereqs.ps1      # One-command prereq installer (Windows)
├── install-prereqs.sh       # One-command prereq installer (macOS/Linux)
├── .env.example             # Environment template — copy to .env
├── nginx/
│   └── nginx.conf           # Nginx reverse proxy + static file config
├── alembic.ini              # Alembic config
├── alembic/
│   └── versions/            # Database migration files
├── app/
│   ├── api/routes/          # API route handlers
│   ├── core/config.py       # App settings (reads from .env)
│   ├── db/
│   │   ├── base.py          # SQLAlchemy declarative base
│   │   ├── models/          # ORM models
│   │   └── session.py       # DB engine and session factory
│   ├── models/              # Pydantic response schemas
│   └── ingestion/           # RSS feed ingestion pipeline
├── scripts/
│   └── ingest_feeds.py      # Standalone ingestion script
├── templates/               # HTML pages (served by Nginx)
│   ├── index.html
│   └── category.html
├── index.html               # Home (root-level, copied into Nginx)
├── search.html
├── entity.html
├── preferences.html
├── rss-config.html
├── webhooks.html
└── static/                  # CSS, JS, assets (served at /static/)
    ├── css/
    │   ├── base/            # CSS variables
    │   ├── components/      # Component styles
    │   ├── layout/          # Navbar, layout, responsive
    │   ├── main/            # Main stylesheet entry
    │   └── pages/           # Page-specific styles
    └── js/
        ├── components/      # UI component scripts
        ├── core/            # Core loader
        ├── data/            # Data / translations
        └── features/        # Feature scripts (news grid, search, etc.)
```

---

## Adding a new migration

After changing a model in `app/db/models/`:

```bash
alembic revision --autogenerate -m "describe what changed"
alembic upgrade head
```

Commit the generated file in `alembic/versions/` so teammates can apply it too.

---

## Switching to the cloud database

When the cloud VM is ready, update `DATABASE_URL` in your `.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@your-cloud-host:5432/dbname
```

No code changes needed — `docker compose up` is only for local dev.
