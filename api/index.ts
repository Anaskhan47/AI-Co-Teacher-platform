import app from "../backend/src/app";

// Vercel handles Express apps natively. 
// Exporting the app directly is more stable than using a serverless-http wrapper.
export default app;
