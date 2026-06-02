const express = require("express");
const router = express.Router();
const MaterialPageBrand = require("../models/MaterialPageBrand");
const upload = require("../middlewares/upload");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const brands = await MaterialPageBrand.find();
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authMiddleware, adminMiddleware, upload.single("logo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Logo obbligatorio" });
  if (!req.body.name) return res.status(400).json({ message: "Nome obbligatorio" });

  const brand = new MaterialPageBrand({
    name: req.body.name,
    logo: req.file.path,
    website: req.body.website || "",
  });

  try {
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, upload.single("logo"), async (req, res) => {
  const updateData = { name: req.body.name, website: req.body.website };
  if (req.file) updateData.logo = req.file.path;

  try {
    const brand = await MaterialPageBrand.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!brand) return res.status(404).json({ message: "Brand non trovato" });
    res.status(200).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const brand = await MaterialPageBrand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand non trovato" });
    res.status(200).json({ message: "Eliminato con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
