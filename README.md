# GramVyapaar AI

AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant
for Rural Micro-Entrepreneurs — built for SIH26091 (Team Lumicore).

**Read [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md) first.** It contains
the full problem statement, what's implemented vs. mocked, architecture,
and the next-task roadmap — everything needed to keep building this without
re-reading the original slide deck.

## Quick start (Docker)

```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

## Quick start (without Docker)

```bash
# backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

# sih2026
