import serverless from 'serverless-http';
import app from '../backend/src/app.js';

/**
 * VERCEL SERVERLESS CATCH-ALL
 * 
 * This single file routes ALL /api/* requests through the real Express app.
 * serverless-http wraps Express so it works in Vercel's serverless environment.
 * 
 * How it works:
 * 1. Vercel receives a request to /api/lessons
 * 2. This catch-all file intercepts it
 * 3. serverless-http converts the Vercel request into an Express request
 * 4. Express routes it to the correct controller (lesson.controller.ts)
 * 5. The response flows back through serverless-http to Vercel
 */
const handler = serverless(app);

export default handler;
