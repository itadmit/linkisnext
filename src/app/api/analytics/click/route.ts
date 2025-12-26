import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { sendWebhook, WEBHOOK_EVENTS } from "@/lib/api/webhooks";

export async function POST(req: NextRequest) {
  let linkId: string | undefined;
  
  try {
    const body = await req.json();
    linkId = body.linkId;
    const { userId } = body;

    if (!linkId || !userId) {
      return NextResponse.json({ error: "נדרשים מזהי לינק ומשתמש" }, { status: 400 });
    }

    // Get user agent info
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";

    // Simple device detection
    let device = "desktop";
    if (/mobile/i.test(userAgent)) device = "mobile";
    else if (/tablet/i.test(userAgent)) device = "tablet";

    // Simple browser detection
    let browser = "other";
    if (/chrome/i.test(userAgent)) browser = "chrome";
    else if (/firefox/i.test(userAgent)) browser = "firefox";
    else if (/safari/i.test(userAgent)) browser = "safari";
    else if (/edge/i.test(userAgent)) browser = "edge";

    // Get link info for webhook
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      select: { title: true, url: true, userId: true },
    });

    if (!link) {
      return NextResponse.json({ error: "לינק לא נמצא" }, { status: 404 });
    }

    // Use transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // Create analytics record
      prisma.analytics.create({
        data: {
          type: "click",
          linkId,
          userId,
          device,
          browser,
          referer,
        },
      }),
      // Increment click count on link
      prisma.link.update({
        where: { id: linkId },
        data: { clicks: { increment: 1 } },
      }),
    ]);

    // Trigger webhook if configured (async, don't wait)
    // TODO: Get webhook configs from database
    // For now, webhooks are triggered but not stored
    sendWebhook(
      {
        url: process.env.WEBHOOK_URL || "",
        events: [WEBHOOK_EVENTS.LINK_CLICKED],
        enabled: !!process.env.WEBHOOK_URL,
      },
      {
        type: WEBHOOK_EVENTS.LINK_CLICKED,
        payload: {
          linkId,
          linkTitle: link.title,
          linkUrl: link.url,
          userId: link.userId,
          device,
          browser,
          referer,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      }
    ).catch((error) => {
      logger.error("Webhook trigger failed", error instanceof Error ? error : new Error(String(error)));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Analytics click error", error instanceof Error ? error : new Error(String(error)), {
      linkId: linkId,
    });
    return NextResponse.json({ error: "שגיאה בשמירת האנליטיקס" }, { status: 500 });
  }
}


