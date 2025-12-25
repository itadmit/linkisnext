import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all leads for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    // Get all landing pages for this user
    const landingPages = await prisma.landingPage.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const landingPageIds = landingPages.map((page) => page.id);

    const leads = await prisma.lead.findMany({
      where: {
        landingPageId: { in: landingPageIds },
      },
      include: {
        landingPage: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת הלידים" }, { status: 500 });
  }
}

// Create a new lead
export async function POST(req: NextRequest) {
  try {
    const { landingPageId, formData } = await req.json();

    if (!landingPageId || !formData) {
      return NextResponse.json(
        { error: "נדרשים landingPageId ו-formData" },
        { status: 400 }
      );
    }

    // Verify landing page exists and is published
    const landingPage = await prisma.landingPage.findUnique({
      where: { id: landingPageId },
    });

    if (!landingPage || landingPage.status !== "published") {
      return NextResponse.json(
        { error: "דף נחיתה לא נמצא או לא פורסם" },
        { status: 404 }
      );
    }

    // Get IP address and user agent from headers
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || null;

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        landingPageId,
        formData: JSON.stringify(formData),
        ipAddress,
        userAgent,
        referrer,
        status: "new",
      },
    });

    // Parse sections to find contact form settings
    let contactFormSettings: any = null;
    try {
      const sections = JSON.parse(landingPage.sections || "[]");
      contactFormSettings = sections.find((s: any) => s.type === "contact-form");
    } catch (e) {
      // Ignore parsing errors
    }

    // Send email notification if enabled
    if (contactFormSettings?.data?.sendEmailNotification && contactFormSettings?.data?.notificationEmail) {
      try {
        // In production, use a proper email service like SendGrid, Resend, etc.
        // For now, we'll just log it
        console.log("Email notification would be sent to:", contactFormSettings.data.notificationEmail);
        console.log("Lead data:", formData);
        
        // TODO: Implement actual email sending
        // await sendEmail({
        //   to: contactFormSettings.data.notificationEmail,
        //   subject: `ליד חדש מדף ${landingPage.name}`,
        //   body: `קיבלת ליד חדש:\n\n${JSON.stringify(formData, null, 2)}`
        // });
      } catch (error) {
        console.error("Failed to send email notification:", error);
      }
    }

    // Send webhook if enabled
    if (contactFormSettings?.data?.enableWebhook && contactFormSettings?.data?.webhookUrl) {
      try {
        const webhookResponse = await fetch(contactFormSettings.data.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "new_lead",
            landingPage: {
              id: landingPage.id,
              name: landingPage.name,
              slug: landingPage.slug,
            },
            lead: {
              id: lead.id,
              formData: formData,
              ipAddress,
              userAgent,
              referrer,
              createdAt: lead.createdAt,
            },
          }),
        });

        if (!webhookResponse.ok) {
          console.error("Webhook failed:", webhookResponse.statusText);
        }
      } catch (error) {
        console.error("Failed to send webhook:", error);
      }
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "שגיאה בשמירת הליד" }, { status: 500 });
  }
}
