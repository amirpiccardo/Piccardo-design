const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, unique: true },
    fields: { type: mongoose.Schema.Types.Mixed, default: {} },
    sections: {
      type: [{ title: { type: String, default: "" }, text: { type: String, default: "" } }],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.PageContent || mongoose.model("PageContent", pageContentSchema);
