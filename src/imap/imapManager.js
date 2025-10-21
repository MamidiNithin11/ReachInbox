import { ImapConnection } from "./imapConnection.js";

export class ImapManager {
  constructor() {
    const accounts = [
      {
        host: process.env.IMAP_1_HOST,
        port: Number(process.env.IMAP_1_PORT),
        secure: process.env.IMAP_1_TLS === "true",
        auth: {
          user: process.env.IMAP_1_USER,
          pass: process.env.IMAP_1_PASS,
        },
      },
      {
        host: process.env.IMAP_2_HOST,
        port: Number(process.env.IMAP_2_PORT),
        secure: process.env.IMAP_2_TLS === "true",
        auth: {
          user: process.env.IMAP_2_USER,
          pass: process.env.IMAP_2_PASS,
        },
      },
      {
        host: process.env.IMAP_3_HOST,
        port: Number(process.env.IMAP_3_PORT),
        secure: process.env.IMAP_3_TLS === "true",
        auth: {
          user: process.env.IMAP_3_USER,
          pass: process.env.IMAP_3_PASS,
        },
      },
    ];

    this.connections = accounts.map(
      (acc) => new ImapConnection(acc.auth.user, acc)
    );
  }

  async startAll() {
    for (const conn of this.connections) {
      try {
        await conn.connect();
      } catch (err) {
        console.error(`Failed IMAP start for ${conn}:`, err);
      }
    }
  }
}
