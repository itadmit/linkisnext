import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        slug: true,
        bio: true,
        avatar: true,
        theme: true,
        backgroundColor: true,
        textColor: true,
        buttonColor: true,
        buttonTextColor: true,
        buttonStyle: true,
        backgroundStyle: true,
        socialLinks: true,
        seoTitle: true,
        seoDescription: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        subscriptionEndsAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת המשתמש" }, { status: 500 });
  }
}

// Update user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const data = await req.json();

    // If changing slug, check if it's available
    if (data.slug) {
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(data.slug) || data.slug.length < 3 || data.slug.length > 30) {
        return NextResponse.json(
          { error: "הסלאג חייב להיות 3-30 תווים, אותיות קטנות, מספרים ומקפים בלבד" },
          { status: 400 }
        );
      }

      const reserved = ["admin", "api", "dashboard", "login", "register", "settings", "analytics"];
      if (reserved.includes(data.slug)) {
        return NextResponse.json({ error: "הסלאג הזה שמור" }, { status: 400 });
      }

      const existingSlug = await prisma.user.findFirst({
        where: { slug: data.slug, NOT: { id: session.user.id } },
      });

      if (existingSlug) {
        return NextResponse.json({ error: "הסלאג כבר תפוס" }, { status: 400 });
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.theme !== undefined && { theme: data.theme }),
        ...(data.backgroundColor !== undefined && { backgroundColor: data.backgroundColor }),
        ...(data.textColor !== undefined && { textColor: data.textColor }),
        ...(data.buttonColor !== undefined && { buttonColor: data.buttonColor }),
        ...(data.buttonTextColor !== undefined && { buttonTextColor: data.buttonTextColor }),
        ...(data.buttonStyle !== undefined && { buttonStyle: data.buttonStyle }),
        ...(data.backgroundStyle !== undefined && { backgroundStyle: data.backgroundStyle }),
        ...(data.socialLinks !== undefined && { socialLinks: data.socialLinks }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
        ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        slug: true,
        bio: true,
        avatar: true,
        theme: true,
        backgroundColor: true,
        textColor: true,
        buttonColor: true,
        buttonTextColor: true,
        buttonStyle: true,
        backgroundStyle: true,
        socialLinks: true,
        seoTitle: true,
        seoDescription: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "שגיאה בעדכון המשתמש" }, { status: 500 });
  }
}

