import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, apiHandler } from "@/lib/api/middleware";
import { successResponse, errorResponse } from "@/lib/api/response";
import { WEBHOOK_EVENTS, sendWebhook } from "@/lib/api/webhooks";
import { logger } from "@/lib/logger";

/**
 * Get user's webhook configurations
 */
export const GET = apiHandler(async (req) => {
  const auth = await requireAuth(req);
  if (!auth.success) return auth.response;

  // For now, webhooks are stored in user settings
  // In the future, create a WebhookConfig model
  const user = await prisma.user.findUnique({
    where: { id: auth.context.userId },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return errorResponse("משתמש לא נמצא", 404);
  }

  // Return empty array for now (webhooks will be stored in separate table)
  return NextResponse.json(successResponse([]));
});

/**
 * Create a new webhook configuration
 */
export const POST = apiHandler(async (req) => {
  const auth = await requireAuth(req);
  if (!auth.success) return auth.response;

  const body = await req.json();
  const { url, secret, events } = body;

  if (!url || !events || !Array.isArray(events)) {
    return errorResponse("נדרשים url ו-events", 400);
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return errorResponse("URL לא תקין", 400);
  }

  // Validate events
  const validEvents = Object.values(WEBHOOK_EVENTS);
  const invalidEvents = events.filter((e: string) => !validEvents.includes(e as any));
  if (invalidEvents.length > 0) {
    return errorResponse(`אירועים לא תקינים: ${invalidEvents.join(", ")}`, 400);
  }

  // Test webhook with a ping event
  const testEvent = {
    type: "webhook.test",
    payload: { message: "Webhook test" },
    timestamp: new Date().toISOString(),
  };

  const testResult = await sendWebhook(
    {
      url,
      secret: secret || undefined,
      events,
      enabled: true,
    },
    testEvent
  );

  if (!testResult) {
    return errorResponse("נכשל בבדיקת ה-webhook. בדוק את ה-URL והרשאות.", 400);
  }

  // TODO: Save webhook config to database
  // For now, just return success
  logger.info("Webhook created", {
    userId: auth.context.userId,
    url,
  });

  return NextResponse.json(
    successResponse(
      {
        id: "temp-id", // Will be replaced with actual ID from database
        url,
        events,
        enabled: true,
      },
      "Webhook נוצר בהצלחה"
    )
  );
});

