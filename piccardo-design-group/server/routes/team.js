const express = require("express");
const router = express.Router();
const multer = require("multer");
const TeamMember = require("../models/TeamMember");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json(teamMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", upload.single("photo"), async (req, res) => {
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

router.put("/:id", upload.single("photo"), async (req, res) => {
  const updateData = {
    name: req.body.name,
    role: req.body.role,
  };

  if (req.file) {
    updateData.photo = req.file.path;
  }

  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!teamMember) return res.status(404).json({ message: "Not found" });
    res.status(200).json(teamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
