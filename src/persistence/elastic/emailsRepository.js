import { esClient } from "./esClient.js";

const index = "emails";

export async function indexEmail(email) {
  await esClient.index({ index, id: email.id, document: email });
}

export async function updateEmailCategory(id, aiCategory) {
  await esClient.update({
    index,
    id,
    doc: { aiCategory },
  });
}

export async function searchEmails({ query, accountId, folder, page = 1, size = 10 } = {}) {
  const body = {
    query: {
      bool: {
        must: query
          ? [{ multi_match: { query, fields: ["subject", "body"] } }]
          : [{ match_all: {} }],
        filter: [],
      },
    },
    from: (page - 1) * size,
    size,
  };

  if (accountId) body.query.bool.filter.push({ term: { accountId } });
  if (folder) body.query.bool.filter.push({ term: { folder } });

  const result = await esClient.search({ index, body });
  return result.hits.hits.map(hit => hit._source);
}
