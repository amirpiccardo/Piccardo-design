const mongoose = require("mongoose");

const newsletterSubscriptionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.NewsletterSubscription ||
  mongoose.model("NewsletterSubscription", newsletterSubscriptionSchema);
