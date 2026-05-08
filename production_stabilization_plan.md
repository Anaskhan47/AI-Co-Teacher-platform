# Production Stabilization Plan

To resolve the "Something Went Wrong" error and ensure a reliable production deployment on Vercel, we need to address infrastructure mismatches between local and cloud environments.

## 1. Backend Security & CORS
- **Issue**: Current CORS is permissive but needs to be explicitly restricted for production security.
- **Action**: Update `backend/src/app.ts` to strictly validate against `ALLOWED_ORIGINS` from the environment.
- **Benefit**: Prevents unauthorized domains from accessing the API while ensuring the deployed frontend is allowed.

## 2. Infrastructure & Routing
- **Issue**: Single Page Applications (SPA) require specific rewrite rules on Vercel to handle browser refreshes on protected routes.
- **Action**: Optimize `vercel.json` to ensure all non-API requests are routed to `index.html`.
- **Benefit**: Resolves "404 on Refresh" and protects deep-linked dashboard routes.

## 3. Database Migration (Post-Deployment)
- **Issue**: SQLite is ephemeral on Vercel and will lose data or crash.
- **Action**: Migrate to PostgreSQL (Neon/Supabase).
- **Steps**:
    1. Provision a Postgres database.
    2. Change `provider = "sqlite"` to `provider = "postgresql"` in `schema.prisma`.
    3. Run `npx prisma db push` with the new connection string.

## 4. Environment Variable Management
- **Issue**: Local `.env` is not available to Vercel.
- **Action**: Define all keys in the Vercel Dashboard.
- **Required Keys**:
    - `DATABASE_URL` (Postgres string)
    - `JWT_SECRET` (Random string)
    - `GEMINI_API_KEY`
    - `GROQ_API_KEY`
    - `ALLOWED_ORIGINS` (Deployment URL)
    - `VITE_API_URL` (Set to `/api` for same-origin deployment)
