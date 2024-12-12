const express = require("express");
const router = express.Router();
const NewsletterSubscription = require("../models/NewsletterSubscription");
const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const newSubscription = new NewsletterSubscription({ email });
    await newSubscription.save();

    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: "Benvenuto!",
      text: "Grazie per esserti iscritto alla nostra newsletter!",
      html: "<strong>Grazie per esserti iscritto alla nostra newsletter!</strong>",
    };

    await sendgrid.send(msg);

    res
      .status(201)
      .json({
        message:
          "Iscrizione avvenuta con successo e mail di benvenuto inviata.",
      });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email già registrata." });
    } else {
      res.status(500).json({ message: "Errore durante l'iscrizione." });
    }
  }
});

router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await NewsletterSubscription.find({}, "email");
    res.status(200).json(subscribers);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Errore durante il recupero delle email degli iscritti.",
      });
  }
});

router.delete("/unsubscribe/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await NewsletterSubscription.deleteOne({ email });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Email non trovata." });
    } else {
      res.status(200).json({ message: "Email eliminata con successo." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante l'eliminazione dell'email." });
  }
});

module.exports = router;
