const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String, default: "" },
  description: { type: String, default: "" },
  category: { type: String, default: "" },
});

module.exports = mongoose.model("Brand", brandSchema);
