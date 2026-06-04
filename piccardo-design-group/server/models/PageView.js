const mongoose = require("mongoose");

const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    referrer: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PageView", pageViewSchema);
