import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all landing pages for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const landingPages = await prisma.landingPage.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            leads: true,
          },
        },
      },
    });

    return NextResponse.json(landingPages);
  } catch (error) {
    console.error("Get landing pages error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת דפי הנחיתה" }, { status: 500 });
  }
}

// Create a new landing page
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const { name, slug, description } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "נדרשים שם וסלאג" },
        { status: 400 }
      );
    }

    // Check if slug is available for this user
    const existingPage = await prisma.landingPage.findUnique({
      where: {
        userId_slug: {
          userId: session.user.id,
          slug: slug,
        },
      },
    });

    if (existingPage) {
      return NextResponse.json({ error: "הסלאג כבר תפוס" }, { status: 400 });
    }

    // Default sections (Hero section)
    const defaultSections = JSON.stringify([
      {
        type: "hero",
        id: "hero-1",
        data: {
          title: "ברוכים הבאים",
          subtitle: "הפתרון המושלם עבורך",
          ctaText: "התחל עכשיו",
          ctaUrl: "#contact",
        },
        style: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
        },
      },
    ]);

    const landingPage = await prisma.landingPage.create({
      data: {
        name,
        slug,
        description,
        sections: defaultSections,
        userId: session.user.id,
      },
    });

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error("Create landing page error:", error);
    return NextResponse.json({ error: "שגיאה ביצירת דף הנחיתה" }, { status: 500 });
  }
}

