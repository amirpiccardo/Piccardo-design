const express = require("express");
const router = express.Router();
const PageContent = require("../models/PageContent");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

const VALID_KEYS = ["home", "about", "privacy", "cookie", "terms", "faq"];

router.get("/:key", async (req, res) => {
  if (!VALID_KEYS.includes(req.params.key)) {
    return res.status(404).json({ message: "Pagina non valida" });
  }
  try {
    const page = await PageContent.findOne({ pageKey: req.params.key });
    res.status(200).json(page || { pageKey: req.params.key, fields: {}, sections: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:key", authMiddleware, adminMiddleware, async (req, res) => {
  if (!VALID_KEYS.includes(req.params.key)) {
    return res.status(404).json({ message: "Pagina non valida" });
  }
  const { fields, sections } = req.body;
  try {
    const page = await PageContent.findOneAndUpdate(
      { pageKey: req.params.key },
      { $set: { fields: fields || {}, sections: sections || [] } },
      { new: true, upsert: true }
    );
    res.status(200).json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
