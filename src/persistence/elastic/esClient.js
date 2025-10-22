import { Client } from "@elastic/elasticsearch";
import pRetry from "p-retry";
import { config } from "../../config/index.js";

export const esClient = new Client({ node: config.elastic.host });
export async function ensureElasticsearchConnection() {
  await pRetry(
    async () => {
      const { status } = await esClient.cluster.health({
        wait_for_status: "yellow",
        timeout: "5s"
      });
      if (status === "red") throw new Error("Elasticsearch status is red");
    },
    {
      retries: 10,
      factor: 1.5,
      minTimeout: 1000,
      maxTimeout: 5000,
      onFailedAttempt: (err) => {
          console.warn(`Waiting for Elasticsearch...`, err.message);
      }
    }
  );
}