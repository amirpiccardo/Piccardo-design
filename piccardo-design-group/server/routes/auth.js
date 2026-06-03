const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Troppi tentativi di accesso. Riprova tra 15 minuti." },
});

// Registrazione protetta: solo un admin esistente può creare nuovi account
router.post("/register", authMiddleware, adminMiddleware, async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email e password sono obbligatori" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "La password deve avere almeno 8 caratteri" });
  }

  try {
    const user = new User({ username, email, password, role: role || "user" });
    await user.save();
    res.status(201).json({ message: "Utente creato con successo" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email o username già in uso" });
    }
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatorie" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenziali non valide" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenziali non valide" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ auth: true, token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/verifyToken", authMiddleware, (req, res) => {
  res.status(200).json({ auth: true, role: req.user.role });
});

// Cambio password dell'utente autenticato
router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Password attuale e nuova sono obbligatorie" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "La nuova password deve avere almeno 8 caratteri" });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Password attuale non corretta" });

    user.password = newPassword; // l'hook pre-save la cifra
    await user.save();
    res.status(200).json({ message: "Password aggiornata con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
