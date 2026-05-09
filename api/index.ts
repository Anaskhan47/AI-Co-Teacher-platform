import app from "../backend/src/app";
import serverless from "serverless-http";

export default serverless(app);
