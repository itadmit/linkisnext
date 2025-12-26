/**
 * API middleware utilities
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { errorResponse } from "./response";

export interface ApiContext {
  userId: string;
  session: any;
  request: NextRequest;
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ success: true; context: ApiContext } | { success: false; response: NextResponse }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: "לא מורשה" },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    context: {
      userId: session.user.id,
      session,
      request: req,
    },
  };
}

/**
 * Middleware to check rate limiting
 */
export function checkApiRateLimit(
  req: NextRequest,
  endpoint: string,
  config?: { windowMs?: number; maxRequests?: number }
): { allowed: boolean; response?: NextResponse } {
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, endpoint, {
    windowMs: config?.windowMs || 15 * 60 * 1000,
    maxRequests: config?.maxRequests || 100,
  });

  if (!rateLimit.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          error: "יותר מדי בקשות. נסה שוב מאוחר יותר.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(config?.maxRequests || 100),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
            "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      ),
    };
  }

  return { allowed: true };
}

/**
 * Wrapper for API route handlers with error handling
 */
export function apiHandler(
  handler: (req: NextRequest, context?: ApiContext) => Promise<Response>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      logger.error(
        "API error",
        error instanceof Error ? error : new Error(String(error)),
        {
          path: req.nextUrl.pathname,
          method: req.method,
        }
      );

      return errorResponse(
        error instanceof Error ? error.message : "שגיאה לא צפויה",
        500
      );
    }
  };
}

/**
 * Validates request body against schema
 */
export function validateBody<T>(
  body: any,
  schema: (data: any) => data is T
): { valid: true; data: T } | { valid: false; error: string } {
  if (!body) {
    return { valid: false, error: "נדרש body בבקשה" };
  }

  if (!schema(body)) {
    return { valid: false, error: "פורמט נתונים לא תקין" };
  }

  return { valid: true, data: body };
}

