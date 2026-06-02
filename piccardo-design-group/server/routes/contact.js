const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const Contact = require("../models/Contact");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Hai inviato troppi messaggi. Riprova tra un'ora." },
});

// POST pubblico (form contatto) con rate limiting anti-spam
router.post("/", contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Nome, email e messaggio sono obbligatori" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Formato email non valido" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ message: "Il messaggio non può superare i 2000 caratteri" });
  }

  try {
    const savedContact = await new Contact({ name, email, message }).save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET e DELETE riservati all'admin
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contatto non trovato" });
    res.status(200).json({ message: "Eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
