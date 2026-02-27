# Backend API

TypeScript backend with **Express**, **Prisma**, **JWT auth**, user preferences, content CRUD, and an **ingestion pipeline** scaffold.

## Features

- **Auth**: Register, login, logout, refresh token; password hashing (bcrypt), JWT; auth middleware for protected routes
- **User model**: UUID, name, email (unique), hashed password, role (user/admin), createdAt/updatedAt, preferences relation
- **Preferences**: Theme (light/dark/system), notifications, language, extensible JSON settings; PATCH endpoint
- **Content**: Flexible schema (title, body, author, status draft/published, tags, metadata JSON); CRUD + list
- **Ingestion pipeline**: Validation → Transformation → Storage; optional queue scaffold; logging and error handling
- **Config**: Environment variables validated on startup (see `.env.example`)

## Setup

```bash
cd backend
cp .env.example .env
# Edit .env: set JWT_SECRET and optionally DATABASE_URL (default SQLite)
npm install
npx prisma generate
npx prisma db push
npm run dev
```

API base: `http://localhost:3000/api/v1`

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | e.g. `file:./dev.db` (SQLite) or PostgreSQL URL |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `PORT` | No | Default 3000 |
| `API_PREFIX` | No | Default `/api/v1` |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `LOG_LEVEL` | No | Default `info` |

## Example routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | No | Register (body: name, email, password) |
| POST | `/api/v1/auth/login` | No | Login (body: email, password) |
| POST | `/api/v1/auth/logout` | Bearer | Logout |
| POST | `/api/v1/auth/refresh` | No | Body: refreshToken |
| GET | `/api/v1/users/me` | Bearer | Current user profile |
| GET | `/api/v1/preferences` | Bearer | Get preferences |
| PATCH | `/api/v1/preferences` | Bearer | Update preferences (theme, notifications, language, settings) |
| GET | `/api/v1/contents` | Optional | List content (query: status, limit, offset) |
| GET | `/api/v1/contents/:id` | Optional | Get one content |
| POST | `/api/v1/contents` | Bearer | Create content |
| PATCH | `/api/v1/contents/:id` | Bearer | Update content (author or admin) |
| DELETE | `/api/v1/contents/:id` | Bearer | Delete content (author or admin) |
| POST | `/api/v1/ingestion` | Bearer | Submit content through ingestion pipeline |

## Folder structure

```
src/
  config/         # env config
  lib/            # logger, errors, prisma client
  middleware/     # auth (requireAuth, requireAdmin)
  validators/     # Zod schemas (auth, preferences, content)
  services/       # auth, preferences, content
  routes/         # auth, user, preferences, content, ingestion
  ingestion/      # pipeline: validation → transformation → storage (+ optional queue)
  app.ts
  index.ts
prisma/
  schema.prisma
```

## Ingestion pipeline

1. **Validation layer**: Validates raw input (title, body, status, tags, metadata).
2. **Transformation layer**: Normalizes title, slug, excerpt.
3. **Storage layer**: Persists to DB with author context.
4. **Optional**: `enqueueIngestion()` scaffold for a future job queue (e.g. Bull + Redis).

Run synchronously via `POST /api/v1/ingestion` (body same as content create) or use `runIngestion()` in code.
