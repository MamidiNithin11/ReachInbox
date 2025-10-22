import { triggerNotifications } from "../integrations/notifications.js";

const sampleEmail = {
  from: "test@example.com",
  subject: "Interested in your demo",
  body: "I’d love to schedule a call this week.",
  aiCategory: "Interested",
  indexedAt: new Date().toISOString(),
};

await triggerNotifications(sampleEmail);
