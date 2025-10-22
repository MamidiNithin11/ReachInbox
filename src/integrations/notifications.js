import dotenv from "dotenv";
import fetch from "node-fetch";
import { logger } from "../utils/logger.js";

dotenv.config();

const slackUrl = process.env.SLACK_WEBHOOK_URL;
const webhookUrl = process.env.WEBHOOK_SITE_URL;

/**
 * Send a Slack notification & Webhook for "Interested" emails
 * @param {object} email - The email data object
 */
export async function triggerNotifications(email) {
  try {
    // 🔹 1. Slack Notification
    if (slackUrl) {
      const slackPayload = {
        text: `📬 *New Interested Lead*\n\n*From:* ${email.from}\n*Subject:* ${email.subject}\n*Category:* ${email.aiCategory}\n\n🧠 Indexed at: ${email.indexedAt}`,
      };

      const slackRes = await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackPayload),
      });

      if (!slackRes.ok) {
        const text = await slackRes.text();
        logger.warn(`⚠️ Slack webhook failed: ${text}`);
      } else {
        logger.info(`✅ Slack notification sent for ${email.subject}`);
      }
    }

    // 🔹 2. Generic Webhook.site Notification
    if (webhookUrl) {
      const webhookPayload = {
        event: "InterestedLead",
        timestamp: new Date().toISOString(),
        email,
      };

      const hookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });

      if (!hookRes.ok) {
        const text = await hookRes.text();
        logger.warn(`⚠️ Webhook.site failed: ${text}`);
      } else {
        logger.info(`✅ Webhook.site triggered for ${email.subject}`);
      }
    }
  } catch (err) {
    logger.error(`❌ Notification error for ${email.subject}: ${err.message}`);
  }
}
