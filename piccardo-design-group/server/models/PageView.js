const mongoose = require("mongoose");

const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    referrer: { type: String, default: "" },
  },
  { timestamps: true }
);

// Elimina automaticamente le visite più vecchie di 13 mesi, per non saturare
// lo storage del piano gratuito MongoDB Atlas.
pageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 395 });

module.exports = mongoose.model("PageView", pageViewSchema);
