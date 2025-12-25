import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "נדרש סלאג" }, { status: 400 });
    }

    // Check if slug is valid
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 30) {
      return NextResponse.json({
        available: false,
        error: "הסלאג חייב להיות 3-30 תווים, אותיות קטנות, מספרים ומקפים בלבד",
      });
    }

    // Reserved slugs
    const reserved = ["admin", "api", "dashboard", "login", "register", "settings", "analytics"];
    if (reserved.includes(slug)) {
      return NextResponse.json({
        available: false,
        error: "הסלאג הזה שמור",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { slug },
    });

    return NextResponse.json({
      available: !existingUser,
      error: existingUser ? "הסלאג כבר תפוס" : null,
    });
  } catch (error) {
    console.error("Check slug error:", error);
    return NextResponse.json({ error: "שגיאה בבדיקת הסלאג" }, { status: 500 });
  }
}

