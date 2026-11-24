# Build Guide Implementation Report

## 1. Architecture implemented
- Frontend: existing Next.js App Router app preserved, refactored to use backend API via `src/lib/api.ts` and server-verified sessions in `src/components/AuthContext.tsx`.
- Backend: standalone Fastify + TypeScript API in `backend/`, with PostgreSQL/Prisma, Zod validation, Argon2id passwords, cookie sessions, CSRF protection, rate limiting, Helmet, CORS, OpenAPI docs, and modular routes/services.

## 2. Backend directory structure
- `backend/src/config` - env validation
- `backend/src/lib` - prisma/logger
- `backend/src/middleware` - auth/csrf hooks
- `backend/src/modules` - auth, users, providers, reviews, favorites, inquiries, admin, health, estimates
- `backend/src/utils` - errors, crypto, password, validation
- `backend/prisma` - schema, migration, seed
- `backend/tests` - unit tests (integration/security scaffolding present)

## 3. Database schema
Implemented Prisma schema with: `User`, `Session`, `EmailVerificationToken`, `PasswordResetToken`, `ProviderProfile`, `ProfessionalCategory`, `ProviderService`, `ProviderPortfolio`, `ProviderVerification`, `Review`, `Favorite`, `ContactInquiry`, `ConstructionEstimate`, `AuditLog`. Includes UUIDs, unique constraints, indexes, FK relations, timestamps, verification/review enums.

## 4. API endpoints
Base: `/api/v1`
- Auth: `POST /auth/register`, `POST /auth/register-provider`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `POST /auth/verify-email`, `POST /auth/resend-verification`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password`
- Users: `GET /users/me`, `PATCH /users/me`
- Providers: `GET /providers`, `GET /providers/:id`, `GET /providers/me/profile`, `PATCH /providers/me/profile`, `POST /providers/me/services`, `DELETE /providers/me/services/:serviceId`, `POST /providers/me/portfolio`, `DELETE /providers/me/portfolio/:portfolioId`
- Reviews: `GET /providers/:providerId/reviews`, `POST /providers/:providerId/reviews`, `DELETE /reviews/:id`
- Favorites: `GET /favorites`, `POST /favorites/:providerId`, `DELETE /favorites/:providerId`
- Inquiries: `POST /inquiries`, `GET /inquiries/me`, `PATCH /inquiries/:id/status`
- Admin: `GET /admin/users`, `GET /admin/providers/pending`, `POST /admin/providers/:id/verify`, `GET /admin/reviews`, `PATCH /admin/reviews/:id/moderate`, `GET /admin/inquiries`, `GET /admin/audit-logs`
- Health/Docs: `GET /health`, `GET /ready`, `GET /docs`

## 5. Authentication implementation
- Argon2id password hashing.
- Server-managed DB sessions with HttpOnly/SameSite=Lax/Secure-in-prod cookies.
- Session rotation on login/register; invalidation on logout/password reset/change.
- Email verification and password reset tokens: cryptographically random, SHA-256 hashed at rest, expiry, single-use.
- Generic login/reset responses; login lockout/progressive throttling fields.
- CSRF token issued by session and required via `X-CSRF-Token` on state-changing requests.

## 6. Authorization implementation
- Server-enforced roles: `HOMEOWNER`, `PROVIDER`, `ADMIN`.
- `requireAuth`, `requireRole`, `requireCsrf` prehandlers.
- Ownership checks for provider services/portfolio, own reviews, provider inquiries, favorites.
- Admin-only verification/moderation/audit endpoints.
- Client role checks are UI-only; API is authoritative.

## 7. Security features
- Zod request validation, Prisma parameterized queries.
- Helmet headers; CORS allowlist with credentials; rate limiting on auth/inquiry/review.
- Centralized error handler; no stack traces in prod responses.
- Pino logging with redaction for secrets/passwords/tokens/cookies.
- `.env.example` files; gitignore covers env/logs/node_modules/build artifacts.
- Guide rendering changed from `dangerouslySetInnerHTML` to React-rendered escaped lines.

## 8. Vulnerabilities fixed
- Removed localStorage plaintext password/provider auth (`src/components/AuthContext.tsx` old implementation).
- Removed client-controlled verification/profile trust; verification is admin-only in API/DB.
- Replaced insecure open redirect in AuthGuard with fixed internal redirect.
- Removed unsafe HTML injection in guide article rendering.
- Added server-side validation, authZ, CSRF, rate limiting, secure session handling.

## 9. Tests executed
- Backend: `npm run prisma:generate`, `npm run typecheck`, `npm run lint`, `npx vitest run tests/unit`, `npm run build`.
- Frontend: `npm run lint`, `npm run build`.
- Dependency audit: `npm audit --audit-level=high` (backend), `npm audit --audit-level=high` (frontend).

## 10. Actual test results
- Backend typecheck: PASS.
- Backend lint: PASS.
- Backend unit tests: PASS (2 files, 3 tests).
- Backend build: PASS.
- Frontend lint: PASS.
- Frontend build: PASS (static generation completed; 3 pre-existing data warnings from empty architect records).
- Backend audit: 8 vulnerabilities reported by npm (5 low, 1 moderate, 2 high) in dependency tree; requires review before production updates.
- Frontend audit: 2 high severity vulnerabilities reported; requires review.

## 11. Dependency audit results
Audits were executed; vulnerabilities remain in current dependency trees. No automatic breaking upgrades were applied. Review `npm audit` output and upgrade with compatibility testing.

## 12. Deployment configuration
- Backend: `backend/.env.example`, build `npm run build`, start `npm start`, migrations `npm run prisma:migrate:deploy`, health `/api/v1/health`, readiness `/api/v1/ready`.
- Frontend: `.env.example` with `NEXT_PUBLIC_API_BASE_URL`; existing Vercel-compatible Next.js build.
- CI: `.github/workflows/ci.yml`; Dependabot configured.

## 13. Deployment status
**Not deployed.** No hosting credentials/platform access were used. Code and configs prepared for independent backend deployment (Render/Railway/etc.) and managed PostgreSQL.

## 14. Environment variables required
Frontend: `NEXT_PUBLIC_API_BASE_URL`.
Backend: see `backend/.env.example` (DATABASE_URL, SESSION_SECRET, FRONTEND_ORIGINS, SMTP/app URLs, rate limit settings, NODE_ENV/PORT).

## 15. Remaining setup steps
1. Provision managed PostgreSQL and set `DATABASE_URL`.
2. Set strong `SESSION_SECRET` and production origins/URLs.
3. Run `cd backend && npm ci && npm run prisma:generate && npm run prisma:migrate:deploy`.
4. Deploy backend service; set `NEXT_PUBLIC_API_BASE_URL` in Vercel frontend.
5. Configure SMTP for verification/reset emails.
6. Create initial admin via controlled seed/env process (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`) in a secure environment.
7. Run integration/security tests against a real test database/CI service.

## 16. Unresolved security issues
- Integration/security tests against live PostgreSQL are not executed in this environment (no DB/docker).
- Dependency vulnerabilities reported by npm audit require reviewed upgrades.
- File uploads not implemented; portfolio uses URL field only (validated as URL). If uploads added, use object storage + malware/type checks.
- In-memory default rate limiting is not distributed across multiple instances; use Redis/store in production.
- Legacy static professional/architect datasets remain for content/display fallback; they should be migrated/curated carefully.

## 17. Future Supabase migration plan
- DB: Prisma/Postgres schema is compatible; migrate via pg_dump/pg_restore or Prisma migrations to Supabase Postgres.
- Auth: abstracted in auth service/routes; replace session/auth provider with Supabase Auth while preserving user IDs/mapping table.
- Storage: move portfolio files to Supabase Storage with RLS and signed URLs.
- RLS: add policies for user-owned rows (favorites, inquiries, profiles) after auth mapping.
- API: keep REST surface; gradually move selected endpoints to Edge Functions where appropriate.
- Testing: add migration tests, auth parity tests, RLS policy tests, and data integrity checks.

## 18. Exact instructions to run locally
### Frontend
```bash
cd /home/anpan/build/Build_Guide
cp .env.example .env.local
npm install
npm run dev
```
### Backend
```bash
cd /home/anpan/build/Build_Guide/backend
cp .env.example .env
# set DATABASE_URL and SESSION_SECRET
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run dev
```

## 19. Exact instructions to deploy
- Backend: deploy `backend/` as Node service, set env vars, run `npm run build` and `npm run prisma:migrate:deploy`, start with `npm start`.
- Frontend: deploy root Next.js app on Vercel, set `NEXT_PUBLIC_API_BASE_URL=https://<backend>/api/v1`.
- Configure CORS `FRONTEND_ORIGINS` to the Vercel domain.

## 20. Limitations
- No live Postgres/SMTP/hosting credentials in this environment; end-to-end deployed verification not possible here.
- Existing frontend still contains static JSON datasets for public content/fallback; full data migration to DB-backed CMS/admin is partial.
- Integration/security suite should be expanded and run in CI with a Postgres service.
