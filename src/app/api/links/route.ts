import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidUrl, sanitizeUrl } from "@/lib/validators";
import { logger } from "@/lib/logger";

// Get all links for the current user
export async function GET() {
  let userId: string | undefined;
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    userId = session.user.id;

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(links);
  } catch (error) {
    logger.error("Get links error", error instanceof Error ? error : new Error(String(error)), {
      userId: userId,
    });
    return NextResponse.json({ error: "שגיאה בטעינת הלינקים" }, { status: 500 });
  }
}

// Create a new link
export async function POST(req: NextRequest) {
  let userId: string | undefined;
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    userId = session.user.id;

    const { title, url, icon, couponCode, discountDescription, startsAt, endsAt } = await req.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: "נדרשים כותרת וכתובת URL" },
        { status: 400 }
      );
    }

    // Validate and sanitize URL
    const sanitizedUrl = sanitizeUrl(url);
    if (!isValidUrl(sanitizedUrl)) {
      return NextResponse.json(
        { error: "כתובת URL לא תקינה. נא להשתמש בכתובת http או https בלבד." },
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
        title: title.trim().slice(0, 200), // Limit title length
        url: sanitizedUrl,
        icon: icon?.slice(0, 50), // Limit icon length
        couponCode: couponCode?.trim().slice(0, 50),
        discountDescription: discountDescription?.trim().slice(0, 200),
        startsAt: parseDateTime(startsAt),
        endsAt: parseDateTime(endsAt),
        order: newOrder,
        userId: session.user.id,
      },
    });

    logger.info("Link created", { linkId: link.id, userId: session.user.id });

    return NextResponse.json(link);
  } catch (error) {
    logger.error("Create link error", error instanceof Error ? error : new Error(String(error)), {
      userId: userId,
    });
    return NextResponse.json({ error: "שגיאה ביצירת הלינק" }, { status: 500 });
  }
}

