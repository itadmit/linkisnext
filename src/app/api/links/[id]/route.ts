import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Update a link
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    // Check if link belongs to user
    const existingLink = await prisma.link.findUnique({
      where: { id },
    });

    if (!existingLink || existingLink.userId !== session.user.id) {
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
      where: { id },
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

    return NextResponse.json(link);
  } catch (error) {
    console.error("Update link error:", error);
    return NextResponse.json({ error: "שגיאה בעדכון הלינק" }, { status: 500 });
  }
}

// Delete a link
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    // Check if link belongs to user
    const existingLink = await prisma.link.findUnique({
      where: { id },
    });

    if (!existingLink || existingLink.userId !== session.user.id) {
      return NextResponse.json({ error: "הלינק לא נמצא" }, { status: 404 });
    }

    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ message: "הלינק נמחק" });
  } catch (error) {
    console.error("Delete link error:", error);
    return NextResponse.json({ error: "שגיאה במחיקת הלינק" }, { status: 500 });
  }
}

