const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const NewsletterSubscription = require("../models/NewsletterSubscription");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Troppi tentativi di iscrizione. Riprova tra un'ora." },
});

router.post("/subscribe", subscribeLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Email non valida" });
  }

  try {
    const newSubscription = new NewsletterSubscription({ email });
    await newSubscription.save();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email già registrata." });
    }
    return res.status(500).json({ message: "Errore durante l'iscrizione." });
  }

  res.status(201).json({ message: "Iscrizione avvenuta con successo!" });
});

router.get("/subscribers", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 500, 500);
    const subscribers = await NewsletterSubscription.find({}, "email createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli iscritti." });
  }
});

router.delete("/unsubscribe/:email", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await NewsletterSubscription.deleteOne({ email: req.params.email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Email non trovata." });
    }
    res.status(200).json({ message: "Email eliminata con successo." });
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'eliminazione." });
  }
});

module.exports = router;
