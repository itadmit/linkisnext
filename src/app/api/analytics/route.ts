import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { format, startOfDay, subDays, eachDayOfInterval } from "date-fns";

export async function GET(req: NextRequest) {
  let userId: string | undefined;
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    userId = session.user.id;

    const searchParams = req.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7");

    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const startOfStartDate = startOfDay(startDate);

    // Get total clicks
    const totalClicks = await prisma.analytics.count({
      where: {
        userId: userId,
        type: "click",
        createdAt: { gte: startOfStartDate },
      },
    });

    // Get clicks for previous period for comparison
    const previousStartDate = subDays(startOfStartDate, days);
    const previousTotalClicks = await prisma.analytics.count({
      where: {
        userId: userId,
        type: "click",
        createdAt: {
          gte: previousStartDate,
          lt: startOfStartDate,
        },
      },
    });

    // Calculate growth percentage
    const growthPercentage = previousTotalClicks > 0
      ? ((totalClicks - previousTotalClicks) / previousTotalClicks) * 100
      : totalClicks > 0 ? 100 : 0;

    // Get clicks by day - format properly for charts
    const allDays = eachDayOfInterval({ start: startOfStartDate, end: endDate });
    const clicksByDayRaw = await prisma.analytics.groupBy({
      by: ["createdAt"],
      where: {
        userId: userId,
        type: "click",
        createdAt: { gte: startOfStartDate },
      },
      _count: true,
    });

    // Create a map of clicks by date
    const clicksByDayMap = new Map<string, number>();
    clicksByDayRaw.forEach((item) => {
      const dateKey = format(new Date(item.createdAt), "yyyy-MM-dd");
      clicksByDayMap.set(dateKey, item._count);
    });

    // Fill in all days with clicks (0 if no clicks)
    const clicksByDay = allDays.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return {
        date: dateKey,
        day: format(day, "dd/MM"),
        clicks: clicksByDayMap.get(dateKey) || 0,
      };
    });

    // Get clicks by hour (for heatmap or hourly chart)
    const clicksByHour = await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
      SELECT EXTRACT(HOUR FROM "createdAt")::int as hour, COUNT(*)::bigint as count
      FROM "Analytics"
      WHERE "userId" = ${userId}
        AND "type" = 'click'
        AND "createdAt" >= ${startOfStartDate}
      GROUP BY hour
      ORDER BY hour
    `;

    // Get clicks by link
    const links = await prisma.link.findMany({
      where: { userId: userId },
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
        userId: userId,
        type: "click",
        createdAt: { gte: startOfStartDate },
      },
      _count: true,
    });

    // Get browser breakdown
    const browsers = await prisma.analytics.groupBy({
      by: ["browser"],
      where: {
        userId: userId,
        type: "click",
        createdAt: { gte: startOfStartDate },
      },
      _count: true,
    });

    // Get country breakdown (if available)
    const countries = await prisma.analytics.groupBy({
      by: ["country"],
      where: {
        userId: userId,
        type: "click",
        createdAt: { gte: startOfStartDate },
        country: { not: null },
      },
      _count: true,
      orderBy: { _count: { country: "desc" } },
      take: 10,
    });

    // Calculate average clicks per day
    const avgClicksPerDay = days > 0 ? totalClicks / days : 0;

    return NextResponse.json({
      totalClicks,
      previousTotalClicks,
      growthPercentage: Math.round(growthPercentage * 100) / 100,
      avgClicksPerDay: Math.round(avgClicksPerDay * 100) / 100,
      clicksByDay,
      clicksByHour: clicksByHour.map((item) => ({
        hour: item.hour,
        clicks: Number(item.count),
      })),
      topLinks: links,
      devices: devices.map((d) => ({ device: d.device || "unknown", count: d._count })),
      browsers: browsers.map((b) => ({ browser: b.browser || "unknown", count: b._count })),
      countries: countries.map((c) => ({ country: c.country || "unknown", count: c._count })),
    });
  } catch (error) {
    logger.error("Analytics error", error instanceof Error ? error : new Error(String(error)), {
      userId: userId,
    });
    return NextResponse.json({ error: "שגיאה בטעינת האנליטיקס" }, { status: 500 });
  }
}


