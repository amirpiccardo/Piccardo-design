const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String, required: true },
});

module.exports = mongoose.model("Brand", brandSchema);
