const mongoose = require("mongoose");

const materialPageBrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String, required: true },
});

module.exports = mongoose.model("MaterialPageBrand", materialPageBrandSchema);
