import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isValidEmail, isValidSlug, getReservedSlugs, validatePasswordStrength } from "@/lib/validators";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  let email: string | undefined;
  
  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = checkRateLimit(clientId, '/api/auth/register', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 registration attempts per 15 minutes
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "יותר מדי ניסיונות הרשמה. נסה שוב מאוחר יותר." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        }
      );
    }

    const body = await req.json();
    email = body.email;
    const { password, name, slug } = body;

    // Validation
    if (!email || !password || !slug) {
      return NextResponse.json(
        { error: "נדרשים אימייל, סיסמה וסלאג" },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "כתובת אימייל לא תקינה" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Check if slug is valid
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { error: "הסלאג חייב להיות 3-30 תווים, אותיות קטנות, מספרים ומקפים בלבד" },
        { status: 400 }
      );
    }

    // Reserved slugs
    const reserved = getReservedSlugs();
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

    logger.info("User registered successfully", { userId: user.id, email: user.email });

    return NextResponse.json({
      message: "המשתמש נוצר בהצלחה",
      user: {
        id: user.id,
        email: user.email,
        slug: user.slug,
      },
    });
  } catch (error) {
    logger.error("Registration error", error instanceof Error ? error : new Error(String(error)), {
      email: email,
    });
    return NextResponse.json(
      { error: "שגיאה ביצירת המשתמש" },
      { status: 500 }
    );
  }
}


