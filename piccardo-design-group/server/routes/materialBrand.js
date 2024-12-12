const express = require("express");
const router = express.Router();
const multer = require("multer");
const MaterialPageBrand = require("../models/MaterialPageBrand");

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
    const brands = await MaterialPageBrand.find();
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", upload.single("logo"), async (req, res) => {
  const brand = new MaterialPageBrand({
    name: req.body.name,
    logo: req.file.path,
    website: req.body.website,
  });

  try {
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", upload.single("logo"), async (req, res) => {
  const updateData = {
    name: req.body.name,
    website: req.body.website,
  };

  if (req.file) {
    updateData.logo = req.file.path;
  }

  try {
    const brand = await MaterialPageBrand.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!brand) return res.status(404).json({ message: "Not found" });
    res.status(200).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const brand = await MaterialPageBrand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
