import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get subscription status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionStatus: true,
        trialEndsAt: true,
        subscriptionId: true,
        subscriptionEndsAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    }

    // Check if trial expired
    if (user.subscriptionStatus === "trial" && user.trialEndsAt) {
      if (new Date() > user.trialEndsAt) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { subscriptionStatus: "expired" },
        });
        user.subscriptionStatus = "expired";
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת המנוי" }, { status: 500 });
  }
}

// Activate subscription after PayPal payment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "נדרש מזהה מנוי" }, { status: 400 });
    }

    // Calculate subscription end date (1 month from now)
    const subscriptionEndsAt = new Date();
    subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "active",
        subscriptionId,
        subscriptionEndsAt,
      },
    });

    return NextResponse.json({
      message: "המנוי הופעל בהצלחה",
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndsAt: user.subscriptionEndsAt,
    });
  } catch (error) {
    console.error("Activate subscription error:", error);
    return NextResponse.json({ error: "שגיאה בהפעלת המנוי" }, { status: 500 });
  }
}

// Cancel subscription
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "cancelled",
      },
    });

    return NextResponse.json({
      message: "המנוי בוטל",
      subscriptionStatus: user.subscriptionStatus,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ error: "שגיאה בביטול המנוי" }, { status: 500 });
  }
}


