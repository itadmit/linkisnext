import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total clicks
    const totalClicks = await prisma.analytics.count({
      where: {
        userId: session.user.id,
        type: "click",
        createdAt: { gte: startDate },
      },
    });

    // Get clicks by day
    const clicksByDay = await prisma.analytics.groupBy({
      by: ["createdAt"],
      where: {
        userId: session.user.id,
        type: "click",
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    // Get clicks by link
    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        clicks: true,
      },
      orderBy: { clicks: "desc" },
      take: 10,
    });

    // Get device breakdown
    const devices = await prisma.analytics.groupBy({
      by: ["device"],
      where: {
        userId: session.user.id,
        type: "click",
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    // Get browser breakdown
    const browsers = await prisma.analytics.groupBy({
      by: ["browser"],
      where: {
        userId: session.user.id,
        type: "click",
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    return NextResponse.json({
      totalClicks,
      clicksByDay,
      topLinks: links,
      devices: devices.map((d) => ({ device: d.device, count: d._count })),
      browsers: browsers.map((b) => ({ browser: b.browser, count: b._count })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת האנליטיקס" }, { status: 500 });
  }
}

