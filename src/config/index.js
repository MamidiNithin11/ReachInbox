import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  elastic: { host: process.env.ES_HOST || "http://localhost:9200" },
  qdrant: { host: process.env.QDRANT_HOST || "http://localhost:6333" }
};