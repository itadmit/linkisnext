import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "נדרש מערך של מזהים" }, { status: 400 });
    }

    // Update all links with their new order
    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        prisma.link.updateMany({
          where: { id, userId: session.user.id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ message: "הסדר עודכן" });
  } catch (error) {
    console.error("Reorder links error:", error);
    return NextResponse.json({ error: "שגיאה בעדכון הסדר" }, { status: 500 });
  }
}

