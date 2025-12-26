import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";
import { logger } from "@/lib/logger";
import { sendWebhook, WEBHOOK_EVENTS } from "@/lib/api/webhooks";

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
        const emailTemplate = emailTemplates.newLead(formData, landingPage.name);
        await sendEmail({
          to: contactFormSettings.data.notificationEmail,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });
        logger.info("Lead notification email sent", { 
          landingPageId: landingPage.id,
          leadId: lead.id,
        });
      } catch (error) {
        logger.error("Failed to send email notification", error instanceof Error ? error : new Error(String(error)), {
          landingPageId: landingPage.id,
          leadId: lead.id,
        });
      }
    }

    // Send webhook if enabled (using new webhook system)
    if (contactFormSettings?.data?.enableWebhook && contactFormSettings?.data?.webhookUrl) {
      sendWebhook(
        {
          url: contactFormSettings.data.webhookUrl,
          secret: contactFormSettings.data.webhookSecret,
          events: [WEBHOOK_EVENTS.LEAD_CREATED],
          enabled: true,
        },
        {
          type: WEBHOOK_EVENTS.LEAD_CREATED,
          payload: {
            leadId: lead.id,
            landingPage: {
              id: landingPage.id,
              name: landingPage.name,
              slug: landingPage.slug,
            },
            formData: formData,
            metadata: {
              ipAddress,
              userAgent,
              referrer,
            },
          },
          timestamp: new Date().toISOString(),
        }
      ).catch((error) => {
        logger.error("Webhook delivery failed", error instanceof Error ? error : new Error(String(error)), {
          landingPageId: landingPage.id,
          leadId: lead.id,
        });
      });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "שגיאה בשמירת הליד" }, { status: 500 });
  }
}
