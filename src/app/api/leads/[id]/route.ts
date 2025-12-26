import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Update a lead
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

    const data = await req.json();

    // Verify lead belongs to user's landing page
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        landingPage: {
          select: { userId: true },
        },
      },
    });

    if (!lead || lead.landingPage.userId !== session.user.id) {
      return NextResponse.json({ error: "ליד לא נמצא" }, { status: 404 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: "שגיאה בעדכון הליד" }, { status: 500 });
  }
}

// Delete a lead
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

    // Verify lead belongs to user's landing page
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        landingPage: {
          select: { userId: true },
        },
      },
    });

    if (!lead || lead.landingPage.userId !== session.user.id) {
      return NextResponse.json({ error: "ליד לא נמצא" }, { status: 404 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ message: "הליד נמחק" });
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json({ error: "שגיאה במחיקת הליד" }, { status: 500 });
  }
}


