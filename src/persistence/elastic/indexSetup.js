import { esClient } from "./esClient.js";

export async function ensureEmailIndex() {
  const index = "emails";

  const exists = await esClient.indices.exists({ index });
  if (exists) return;

  console.log("📦 Creating Elasticsearch index:", index);
  await esClient.indices.create({
    index,
    mappings: {
      properties: {
        id: { type: "keyword" },
        accountId: { type: "keyword" },
        folder: { type: "keyword" },
        subject: { type: "text" },
        body: { type: "text" },
        from: { type: "keyword" },
        to: { type: "keyword" },
        date: { type: "date" },
        aiCategory: { type: "keyword" },
        indexedAt: { type: "date" }
      }
    }
  });
}
