const express = require("express");
const router = express.Router();
const Fair = require("../models/Fair");

router.get("/", async (req, res) => {
  try {
    const fairs = await Fair.find();
    res.status(200).json(fairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const fair = new Fair(req.body);
  try {
    const newFair = await fair.save();
    res.status(201).json(newFair);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const fair = await Fair.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!fair) return res.status(404).json({ message: "Not found" });
    res.status(200).json(fair);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const fair = await Fair.findByIdAndDelete(req.params.id);
    if (!fair) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
