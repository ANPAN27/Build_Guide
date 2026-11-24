# Build Guide Backend

Standalone Fastify + TypeScript + PostgreSQL/Prisma API for Build Guide.

## Setup
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run dev
```

## Scripts
- `npm run dev` - dev server
- `npm run build` - type build
- `npm start` - run built server
- `npm run typecheck` - TypeScript checks
- `npm run lint` - ESLint
- `npm test` - Vitest
- `npm run prisma:migrate:deploy` - apply migrations

## Production
Set required env vars from `.env.example`, run migrations, then start with `npm start`. Expose only the API; keep PostgreSQL private.
