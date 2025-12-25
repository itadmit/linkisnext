import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { linkId, userId } = await req.json();

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

    // Create analytics record
    await prisma.analytics.create({
      data: {
        type: "click",
        linkId,
        userId,
        device,
        browser,
        referer,
      },
    });

    // Increment click count on link
    await prisma.link.update({
      where: { id: linkId },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics click error:", error);
    return NextResponse.json({ error: "שגיאה בשמירת האנליטיקס" }, { status: 500 });
  }
}

