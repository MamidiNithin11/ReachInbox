import { ImapConnection } from "./imapConnection.js";

/**
 * ImapManager
 * - Initializes and manages multiple IMAP account connections.
 * - Reads credentials from .env variables.
 * - Handles connection retries and error isolation per account.
 */

export class ImapManager {
  constructor() {
    // Read up to 3 configured IMAP accounts
    const accounts = [
      {
        id: "account1",
        host: process.env.IMAP_1_HOST,
        port: Number(process.env.IMAP_1_PORT),
        secure: process.env.IMAP_1_TLS === "true",
        auth: {
          user: process.env.IMAP_1_USER,
          pass: process.env.IMAP_1_PASS,
        },
      },
      {
        id: "account2",
        host: process.env.IMAP_2_HOST,
        port: Number(process.env.IMAP_2_PORT),
        secure: process.env.IMAP_2_TLS === "true",
        auth: {
          user: process.env.IMAP_2_USER,
          pass: process.env.IMAP_2_PASS,
        },
      },
      {
        id: "account3",
        host: process.env.IMAP_3_HOST,
        port: Number(process.env.IMAP_3_PORT),
        secure: process.env.IMAP_3_TLS === "true",
        auth: {
          user: process.env.IMAP_3_USER,
          pass: process.env.IMAP_3_PASS,
        },
      },
    ].filter(
      (acc) => acc.host && acc.auth?.user && acc.auth?.pass
    ); // Ignore empty accounts

    if (accounts.length === 0) {
      console.error("❌ No valid IMAP accounts found in environment variables.");
    } else {
      console.log(`📬 Loaded ${accounts.length} IMAP accounts for syncing.`);
    }

    // Create connection instances
    this.connections = accounts.map(
      (acc) => new ImapConnection(acc.auth.user, acc)
    );
  }

  /**
   * Start all IMAP connections sequentially
   */
  async startAll() {
    for (const conn of this.connections) {
      try {
        await conn.connect();
      } catch (err) {
        console.error(`❌ Failed to start IMAP for ${conn.accountId}:`, err);
      }
    }
  }
}
