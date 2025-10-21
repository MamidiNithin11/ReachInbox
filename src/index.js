import app from "./server/app.js";
import dotenv from "dotenv";
import { ImapManager } from "./imap/imapManager.js";
import { ensureElasticsearchConnection } from "./persistence/elastic/esClient.js";
import { ensureEmailIndex } from "./persistence/elastic/indexSetup.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await ensureElasticsearchConnection();
  await ensureEmailIndex();

  const imapManager = new ImapManager();
  await imapManager.startAll();

  app.listen(PORT, () => {
    console.log(`🚀 ReachInbox Onebox running on port ${PORT}`);
  });
}

bootstrap().catch(err => console.error("Startup failure:", err));
