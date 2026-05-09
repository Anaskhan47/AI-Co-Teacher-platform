import { VercelResponse } from '@vercel/node';

/**
 * ENTERPRISE API RESPONSE PROTOCOL
 * Ensures a standardized { success, data, error } format across all native functions.
 */

export const sendSuccess = (res: VercelResponse, data: any, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    error: null
  });
};

export const sendError = (res: VercelResponse, message: string, code = "INTERNAL_ERROR", status = 500) => {
  console.error(`[API_ERROR] ${code}: ${message}`);
  return res.status(status).json({
    success: false,
    data: null,
    error: {
      code,
      message
    }
  });
};

/**
 * ABSOLUTE ZERO FALLBACK
 * Guarantees a valid JSON response even if the entire function logic crashes.
 */
export const withSafeRuntime = async (res: VercelResponse, logic: () => Promise<any>) => {
  try {
    await logic();
  } catch (error: any) {
    return sendError(res, error?.message || "A critical system error occurred.", "RUNTIME_CRASH");
  }
};
