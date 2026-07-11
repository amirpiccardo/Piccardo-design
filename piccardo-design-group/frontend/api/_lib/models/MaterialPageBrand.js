const mongoose = require("mongoose");

const materialPageBrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String, default: "" },
  description: { type: String, default: "" },
  category: { type: String, default: "" },
});

module.exports =
  mongoose.models.MaterialPageBrand || mongoose.model("MaterialPageBrand", materialPageBrandSchema);
