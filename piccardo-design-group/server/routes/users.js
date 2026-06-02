const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { password, ...safeFields } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, safeFields, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Utente non trovato" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });
    res.status(200).json({ message: "Utente eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
