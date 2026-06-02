const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember");
const upload = require("../middlewares/upload");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json(teamMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authMiddleware, adminMiddleware, upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Foto obbligatoria" });
  if (!req.body.name || !req.body.role) {
    return res.status(400).json({ message: "Nome e ruolo sono obbligatori" });
  }

  const teamMember = new TeamMember({
    name: req.body.name,
    role: req.body.role,
    photo: req.file.path,
  });

  try {
    const newTeamMember = await teamMember.save();
    res.status(201).json(newTeamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, upload.single("photo"), async (req, res) => {
  const updateData = { name: req.body.name, role: req.body.role };
  if (req.file) updateData.photo = req.file.path;

  try {
    const teamMember = await TeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!teamMember) return res.status(404).json({ message: "Membro non trovato" });
    res.status(200).json(teamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) return res.status(404).json({ message: "Membro non trovato" });
    res.status(200).json({ message: "Eliminato con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
