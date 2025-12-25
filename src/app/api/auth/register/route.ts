import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, slug } = await req.json();

    // Validation
    if (!email || !password || !slug) {
      return NextResponse.json(
        { error: "נדרשים אימייל, סיסמה וסלאג" },
        { status: 400 }
      );
    }

    // Check if slug is valid
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 30) {
      return NextResponse.json(
        { error: "הסלאג חייב להיות 3-30 תווים, אותיות קטנות, מספרים ומקפים בלבד" },
        { status: 400 }
      );
    }

    // Reserved slugs
    const reserved = ["admin", "api", "dashboard", "login", "register", "settings", "analytics"];
    if (reserved.includes(slug)) {
      return NextResponse.json(
        { error: "הסלאג הזה שמור" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "האימייל כבר קיים במערכת" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existingSlug = await prisma.user.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "הסלאג כבר תפוס" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Calculate trial end date (7 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || slug,
        slug,
        subscriptionStatus: "trial",
        trialEndsAt,
      },
    });

    return NextResponse.json({
      message: "המשתמש נוצר בהצלחה",
      user: {
        id: user.id,
        email: user.email,
        slug: user.slug,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "שגיאה ביצירת המשתמש" },
      { status: 500 }
    );
  }
}

