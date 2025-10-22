import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { extractPlainText } from "../utils/htmlToText.js";
import { v4 as uuid } from "uuid";
import { indexEmail, updateEmailCategory } from "../persistence/elastic/emailsRepository.js";
import { classifier } from "../ai/classifier.js";
import { logger } from "../utils/logger.js";

export class ImapConnection {
  constructor(accountId, options) {
    this.accountId = accountId;
    this.options = {
      ...options,
      logger: logger.debug ? logger : false
    };
    this.client = new ImapFlow({
      ...options,
      logger: false
    });
  }
  async connect() {
    await this.client.connect();
    console.log(`✅ IMAP connected for account: ${this.accountId}`);

    await this.initialSync();

    this.client.on("exists", async (seq) => {
      try {
        const lock = await this.client.getMailboxLock("INBOX");
        const msg = await this.client.fetchOne(seq, {
          source: true,
          envelope: true,
          bodyStructure: true,
        });
        if (msg?.source) {
          const parsed = await simpleParser(msg.source);
          const body = extractPlainText(parsed.html || parsed.text || "");
          const email = {
            id: uuid(),
            accountId: this.accountId,
            folder: "INBOX",
            subject: parsed.subject || "(No subject)",
            body,
            from: parsed.from?.text || "",
            to: parsed.to?.value?.map((v) => v.address) || [],
            date: parsed.date?.toISOString() || new Date().toISOString(),
            aiCategory: "Uncategorized",
            indexedAt: new Date().toISOString(),
          };
          await indexEmail(email);
          console.log(`🔎 Indexed email ${email.subject}`);
          try {
            const category = await classifier.classify(email);
            email.aiCategory = category;
            await updateEmailCategory(email.id, category);
            console.log(`🤖 AI category (${this.accountId}): ${email.subject} → ${category}`);
          } catch (err) {
            console.error("AI classification failed:", err);
          }
        }

        lock.release();
      } catch (err) {
        console.error(`✅ IMAP fetch error for ${this.accountId}:`, err);
      }
    });
    setInterval(async () => {
      if (!this.client.usable) return;
      await this.client.idle();
    }, 29 * 60 * 1000);
  }

  async initialSync() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const lock = await this.client.getMailboxLock("INBOX");
  
    try {
      const uids = await this.client.search({ since }); // returns UID list
  
      if (uids.length === 0) return;
      for await (const msg of this.client.fetch(uids, { envelope: true, uid: true })) {
        console.log(`🔹 Historical email (${this.accountId}): ${msg.envelope.subject}`);
      }
    } catch (err) {
      console.error(`Initial sync failed for ${this.accountId}:`, err);
    } finally {
      lock.release();
    }
  }
}

