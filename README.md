# Build Guide

Build Guide is a Next.js frontend + standalone Fastify backend for connecting homeowners with construction professionals.

## Repository layout
- `/` - Next.js frontend
- `/backend` - Fastify API, Prisma schema, migrations, tests
- `/docs` - implementation/deployment report

## Local development
### 1. Backend
```bash
cd backend
cp .env.example .env
# configure DATABASE_URL and SESSION_SECRET
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run dev
```

### 2. Frontend
```bash
cp .env.example .env.local
npm install
npm run dev
```

Frontend expects `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:4000/api/v1`).

## Quality checks
Frontend:
```bash
npm run lint
npm run build
```

Backend:
```bash
cd backend
npm run typecheck
npm run lint
npm test
npm run build
```

## Deployment
- Frontend: Vercel (existing project setup). Set `NEXT_PUBLIC_API_BASE_URL`.
- Backend: deploy independently (Render/Railway/etc.) with managed PostgreSQL. Run Prisma migrations before/at deploy.
- See `docs/IMPLEMENTATION_REPORT.md` for architecture, security, and migration notes.
