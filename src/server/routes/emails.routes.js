import { Router } from "express";
import { searchEmails } from "../../persistence/elastic/emailsRepository.js";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const { q, account, folder, page, size } = req.query;
    const results = await searchEmails({
      query: q,
      accountId: account,
      folder: folder,
      page: page ? Number(page) : 1,
      size: size ? Number(size) : 10,
    });
    res.json({ count: results.length, results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
