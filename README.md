# news.avild.com

Security News & Threat Intelligence Platform — FastAPI backend, PostgreSQL database, Jinja2 templates.

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

## Local Setup

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

The defaults in `.env` already match the Docker Compose database — no edits needed for local dev.

### 4. Start the local database

```bash
docker compose up -d
```

This spins up a PostgreSQL 16 container on `localhost:5432` with the database `avild_news`.

### 5. Run database migrations

```bash
alembic upgrade head
```

This creates all the tables. Run this again after any new migration is added.

### 6. Start the dev server

```bash
uvicorn main:app --reload
```

The app will be available at **http://localhost:8000**

---

## Key URLs (local)

| URL | Description |
|-----|-------------|
| http://localhost:8000/ | Home page |
| http://localhost:8000/category | Category page |
| http://localhost:8000/docs | Swagger UI — interactive API explorer |
| http://localhost:8000/redoc | ReDoc — readable API reference |
| http://localhost:8000/api/news/ | News feed (JSON) |
| http://localhost:8000/api/news/{id} | Single news item by ID |

---

## Project Structure

```
kiber/
├── main.py                  # FastAPI app entry point
├── requirements.txt
├── docker-compose.yml       # Local Postgres
├── install-prereqs.ps1      # One-command prereq installer (Windows)
├── install-prereqs.sh       # One-command prereq installer (macOS/Linux)
├── .env.example             # Environment template — copy to .env
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
│   └── models/              # Pydantic response schemas
├── templates/               # Jinja2 HTML templates
└── static/                  # CSS, JS, assets
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
