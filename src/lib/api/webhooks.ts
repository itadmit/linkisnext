/**
 * Webhook system for external integrations
 */

import { logger } from "@/lib/logger";

export interface WebhookEvent {
  type: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
  enabled: boolean;
}

/**
 * Sends a webhook event
 */
export async function sendWebhook(
  config: WebhookConfig,
  event: WebhookEvent
): Promise<boolean> {
  if (!config.enabled || !config.url) {
    return false;
  }

  // Check if event type is subscribed
  if (!config.events.includes(event.type) && !config.events.includes("*")) {
    return false;
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "LinkHub-Webhooks/1.0",
    };

    // Add signature if secret is provided
    if (config.secret) {
      const signature = await generateSignature(event, config.secret);
      headers["X-LinkHub-Signature"] = signature;
    }

    const response = await fetch(config.url, {
      method: "POST",
      headers,
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      logger.warn("Webhook delivery failed", {
        url: config.url,
        status: response.status,
        eventType: event.type,
      });
      return false;
    }

    logger.info("Webhook delivered successfully", {
      url: config.url,
      eventType: event.type,
    });

    return true;
  } catch (error) {
    logger.error(
      "Webhook delivery error",
      error instanceof Error ? error : new Error(String(error)),
      {
        url: config.url,
        eventType: event.type,
      }
    );
    return false;
  }
}

/**
 * Generates HMAC signature for webhook
 */
async function generateSignature(
  event: WebhookEvent,
  secret: string
): Promise<string> {
  const crypto = await import("crypto");
  const payload = JSON.stringify(event);
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

/**
 * Verifies webhook signature
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  LINK_CLICKED: "link.clicked",
  LEAD_CREATED: "lead.created",
  LEAD_UPDATED: "lead.updated",
  LANDING_PAGE_PUBLISHED: "landing_page.published",
  USER_REGISTERED: "user.registered",
  SUBSCRIPTION_ACTIVATED: "subscription.activated",
  SUBSCRIPTION_CANCELLED: "subscription.cancelled",
} as const;

