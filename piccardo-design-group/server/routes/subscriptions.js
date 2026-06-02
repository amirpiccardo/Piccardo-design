const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const NewsletterSubscription = require("../models/NewsletterSubscription");
const sendgrid = require("@sendgrid/mail");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

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

    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: "Benvenuto nella newsletter di Piccardo Design Group!",
      text: "Grazie per esserti iscritto alla nostra newsletter. Riceverai aggiornamenti sulle nostre novità e partnership.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Benvenuto in Piccardo Design Group!</h2>
          <p>Grazie per esserti iscritto alla nostra newsletter.</p>
          <p>Riceverai aggiornamenti sulle nostre novità, partnership e prodotti.</p>
          <hr/>
          <small>Per disiscriverti, rispondi a questa email con oggetto "Disiscrizione".</small>
        </div>
      `,
    };

    await sendgrid.send(msg);
    res.status(201).json({ message: "Iscrizione avvenuta con successo!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email già registrata." });
    }
    res.status(500).json({ message: "Errore durante l'iscrizione." });
  }
});

router.get("/subscribers", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const subscribers = await NewsletterSubscription.find({}, "email createdAt");
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
