# Production Deployment Guide: AI Co-Teacher

This guide details the manual steps required to transition from local development to a stable production environment on Vercel.

## 1. Database Migration (SQLite to PostgreSQL)
SQLite is NOT supported for persistent storage on Vercel. You must migrate to a cloud-hosted PostgreSQL database (e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)).

### Steps:
1. **Provision Database**: Create a new PostgreSQL instance on your preferred provider.
2. **Update Schema**: Modify `backend/src/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Generate Client**: Run `npx prisma generate --schema=backend/src/prisma/schema.prisma`.
4. **Push Schema**: Run `npx prisma db push` using your new `DATABASE_URL`.

## 2. Environment Variables (Vercel Dashboard)
You MUST add these variables in **Vercel Project Settings > Environment Variables**. Do not rely on local `.env` files.

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Your new Postgres connection string. |
| `JWT_SECRET` | `[Random 32-char string]` | Security key for user sessions. |
| `GEMINI_API_KEY` | `[Your Key]` | Google Generative AI access. |
| `GROQ_API_KEY` | `[Your Key]` | Llama 3 Inference access. |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Your deployed frontend domain. |
| `VITE_API_URL` | `/api` | Use `/api` if deploying both on Vercel. |

## 3. Deployment Checklist
- [ ] **Rotate Exposed Keys**: Since your previous keys were in the prompt, generate new ones immediately in your AI provider dashboards.
- [ ] **Verify Routing**: The `vercel.json` has been optimized to handle React Router navigation. 
- [ ] **CORS Hardening**: The backend now strictly validates origins in production mode (`NODE_ENV=production`).

## 4. Troubleshooting "Something Went Wrong"
If you still see the error screen:
1. Append `?debug=true` to your URL (e.g., `https://my-app.vercel.app/app/dashboard?debug=true`).
2. The Error Boundary will now display the raw stack trace.
3. Common causes: Missing `JWT_SECRET` or failed database connection.
