import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache, cacheKeys } from "@/lib/cache";
import { logger } from "@/lib/logger";

// Update a link
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let linkId: string | undefined;
  let userId: string | undefined;
  
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    linkId = id;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    userId = session.user.id;

    // Check if link belongs to user
    const existingLink = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!existingLink || existingLink.userId !== userId) {
      return NextResponse.json({ error: "הלינק לא נמצא" }, { status: 404 });
    }

    const data = await req.json();

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

    const link = await prisma.link.update({
      where: { id: linkId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.couponCode !== undefined && { couponCode: data.couponCode }),
        ...(data.discountDescription !== undefined && { discountDescription: data.discountDescription }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.startsAt !== undefined && {
          startsAt: parseDateTime(data.startsAt),
        }),
        ...(data.endsAt !== undefined && {
          endsAt: parseDateTime(data.endsAt),
        }),
      },
    });

    // Invalidate cache
    if (userId) {
      cache.delete(cacheKeys.userLinks(userId));
    }

    return NextResponse.json(link);
  } catch (error) {
    logger.error("Update link error", error instanceof Error ? error : new Error(String(error)), {
      linkId: linkId,
      userId: userId,
    });
    return NextResponse.json({ error: "שגיאה בעדכון הלינק" }, { status: 500 });
  }
}

// Delete a link
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let linkId: string | undefined;
  let userId: string | undefined;
  
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    linkId = id;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    userId = session.user.id;

    // Check if link belongs to user
    const existingLink = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!existingLink || existingLink.userId !== userId) {
      return NextResponse.json({ error: "הלינק לא נמצא" }, { status: 404 });
    }

    await prisma.link.delete({
      where: { id: linkId },
    });

    // Invalidate cache
    cache.delete(cacheKeys.userLinks(userId));

    return NextResponse.json({ message: "הלינק נמחק" });
  } catch (error) {
    logger.error("Delete link error", error instanceof Error ? error : new Error(String(error)), {
      linkId: linkId,
      userId: userId,
    });
    return NextResponse.json({ error: "שגיאה במחיקת הלינק" }, { status: 500 });
  }
}

