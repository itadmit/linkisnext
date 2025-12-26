import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache, cacheKeys } from "@/lib/cache";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  let userId: string | undefined;
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    userId = session.user.id;

    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "נדרש מערך של מזהים" }, { status: 400 });
    }

    // Update all links with their new order
    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        prisma.link.updateMany({
          where: { id, userId: userId },
          data: { order: index },
        })
      )
    );

    // Invalidate cache
    cache.delete(cacheKeys.userLinks(userId));

    return NextResponse.json({ message: "הסדר עודכן" });
  } catch (error) {
    logger.error("Reorder links error", error instanceof Error ? error : new Error(String(error)), {
      userId: userId,
    });
    return NextResponse.json({ error: "שגיאה בעדכון הסדר" }, { status: 500 });
  }
}


