const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const PageView = require("../models/PageView");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// Limita gli abusi sul tracking pubblico
const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Registra una visita (pubblico). Ignora le pagine admin.
router.post("/track", trackLimiter, async (req, res) => {
  try {
    const { path, referrer } = req.body;
    if (!path || typeof path !== "string") return res.status(204).end();
    if (path.startsWith("/admin") || path.startsWith("/login")) return res.status(204).end();
    await PageView.create({ path: path.substring(0, 200), referrer: (referrer || "").substring(0, 300) });
    res.status(204).end();
  } catch {
    res.status(204).end();
  }
});

// Statistiche aggregate (solo admin)
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [total, last30, topPages, byDay] = await Promise.all([
      PageView.countDocuments(),
      PageView.countDocuments({ createdAt: { $gte: since } }),
      PageView.aggregate([
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      PageView.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    res.json({ total, last30, topPages, byDay });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
