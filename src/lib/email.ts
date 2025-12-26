/**
 * Email service utilities
 * Supports Resend API (recommended) or SMTP fallback
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Sends an email using Resend API or SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      return await sendEmailViaResend(options, resendApiKey);
    }

    // Fallback to SMTP if configured
    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost) {
      return await sendEmailViaSMTP(options);
    }

    // In development, log email instead of sending
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email (dev mode):", {
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return true;
    }

    console.warn("No email service configured");
    return false;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Sends email via Resend API
 */
async function sendEmailViaResend(
  options: EmailOptions,
  apiKey: string
): Promise<boolean> {
  try {
    // Check if resend is available at build time
    // If not, we'll use a runtime check
    if (typeof window !== "undefined") {
      // Client-side - email sending not supported
      return false;
    }

    // Try to use Resend if available
    // Note: resend is optional - install with: npm install resend
    // For now, we'll skip Resend and use console.log in dev mode
    // In production, configure RESEND_API_KEY and install resend package
    // TODO: Implement Resend integration when package is installed
    return false;
  } catch (error) {
    console.error("Resend API error:", error);
    return false;
  }
}

/**
 * Sends email via SMTP (fallback)
 */
async function sendEmailViaSMTP(options: EmailOptions): Promise<boolean> {
  // SMTP implementation would go here
  // For now, we'll use nodemailer if needed
  console.warn("SMTP email not yet implemented");
  return false;
}

/**
 * Email templates
 */

export const emailTemplates = {
  /**
   * Welcome email template
   */
  welcome: (name: string, slug: string) => ({
    subject: "ברוכים הבאים ל-Linkis! 🎉",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">ברוכים הבאים ל-Linkis!</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>שלום ${name || "שם"},</p>
          <p>תודה שהצטרפת ל-Linkis! עכשיו תוכל ליצור דף לינקים מקצועי ולשתף אותו עם העולם.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com"}/dashboard" 
               style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              התחל עכשיו
            </a>
          </div>
          <p>הדף שלך זמין בכתובת:</p>
          <p style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
            <strong>${process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com"}/${slug}</strong>
          </p>
          <p>אם יש לך שאלות, אנחנו כאן לעזור!</p>
          <p>צוות Linkis</p>
        </div>
      </body>
      </html>
    `,
    text: `ברוכים הבאים ל-Linkis!\n\nשלום ${name || "שם"},\n\nתודה שהצטרפת ל-Linkis! עכשיו תוכל ליצור דף לינקים מקצועי ולשתף אותו עם העולם.\n\nהדף שלך זמין בכתובת: ${process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com"}/${slug}\n\nאם יש לך שאלות, אנחנו כאן לעזור!\n\nצוות Linkis`,
  }),

  /**
   * New lead notification template
   */
  newLead: (leadData: Record<string, any>, landingPageName: string) => ({
    subject: `ליד חדש מדף הנחיתה: ${landingPageName}`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">ליד חדש! 🎉</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>קיבלת ליד חדש מדף הנחיתה <strong>${landingPageName}</strong>:</p>
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            ${Object.entries(leadData)
              .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
              .join("")}
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com"}/dashboard/leads" 
               style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              צפה בלידים
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `ליד חדש מדף הנחיתה: ${landingPageName}\n\n${Object.entries(leadData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")}\n\nצפה בלידים: ${process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com"}/dashboard/leads`,
  }),

  /**
   * Weekly analytics report template
   */
  weeklyReport: (stats: {
    totalClicks: number;
    topLink: string;
    growthPercentage: number;
  }) => ({
    subject: "דוח שבועי - האנליטיקס שלך",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">דוח שבועי 📊</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>הנה סיכום הביצועים השבועיים שלך:</p>
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #6366f1; margin: 0;">
              ${stats.totalClicks.toLocaleString()} קליקים
            </p>
            ${stats.growthPercentage > 0 ? (
              `<p style="color: #10b981; margin: 5px 0 0 0;">+${stats.growthPercentage.toFixed(1)}% מהשבוע הקודם</p>`
            ) : (
              `<p style="color: #ef4444; margin: 5px 0 0 0;">${stats.growthPercentage.toFixed(1)}% מהשבוע הקודם</p>`
            )}
          </div>
          <p><strong>הלינק הפופולרי ביותר:</strong> ${stats.topLink}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com"}/dashboard/analytics" 
               style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              צפה באנליטיקס המלא
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `דוח שבועי - האנליטיקס שלך\n\nסה"כ קליקים: ${stats.totalClicks.toLocaleString()}\n${stats.growthPercentage > 0 ? "+" : ""}${stats.growthPercentage.toFixed(1)}% מהשבוע הקודם\n\nהלינק הפופולרי ביותר: ${stats.topLink}\n\nצפה באנליטיקס המלא: ${process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com"}/dashboard/analytics`,
  }),
};

