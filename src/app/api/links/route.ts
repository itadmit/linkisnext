import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all links for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Get links error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת הלינקים" }, { status: 500 });
  }
}

// Create a new link
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const { title, url, icon, couponCode, discountDescription, startsAt, endsAt } = await req.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: "נדרשים כותרת וכתובת URL" },
        { status: 400 }
      );
    }

    // Convert datetime-local format (YYYY-MM-DDTHH:mm) to Date object
    const parseDateTime = (dateTimeString: string | null | undefined): Date | null => {
      if (!dateTimeString || dateTimeString.trim() === "") return null;
      try {
        // datetime-local format: YYYY-MM-DDTHH:mm
        // We need to treat it as local time, not UTC
        const [datePart, timePart] = dateTimeString.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        
        // Create date in local timezone
        const date = new Date(year, month - 1, day, hours, minutes);
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    // Get the highest order number
    const lastLink = await prisma.link.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: "desc" },
    });

    const newOrder = lastLink ? lastLink.order + 1 : 0;

    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon,
        couponCode,
        discountDescription,
        startsAt: parseDateTime(startsAt),
        endsAt: parseDateTime(endsAt),
        order: newOrder,
        userId: session.user.id,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json({ error: "שגיאה ביצירת הלינק" }, { status: 500 });
  }
}

