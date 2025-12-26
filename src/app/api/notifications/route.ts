import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get notifications for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    // Get all landing pages for this user
    const landingPages = await prisma.landingPage.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const landingPageIds = landingPages.map((page) => page.id);

    // Get new leads (status = "new") from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newLeads = await prisma.lead.findMany({
      where: {
        landingPageId: { in: landingPageIds },
        status: "new",
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        landingPage: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // Limit to 10 most recent
    });

    // Format notifications
    const notifications = newLeads.map((lead) => {
      const formData = JSON.parse(lead.formData);
      return {
        id: lead.id,
        type: "new_lead",
        title: "ליד חדש",
        message: `ליד חדש מדף "${lead.landingPage.name}"`,
        leadName: formData.name || "ללא שם",
        landingPageName: lead.landingPage.name,
        createdAt: lead.createdAt,
        link: `/dashboard/leads`,
      };
    });

    // Add system notifications (placeholder for future)
    // You can add system notifications here later

    return NextResponse.json({
      notifications,
      unreadCount: notifications.length,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת ההתראות" }, { status: 500 });
  }
}


