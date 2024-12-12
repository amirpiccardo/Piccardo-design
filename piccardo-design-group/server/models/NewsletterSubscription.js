const mongoose = require("mongoose");

const newsletterSubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const NewsletterSubscription = mongoose.model(
  "NewsletterSubscription",
  newsletterSubscriptionSchema
);

module.exports = NewsletterSubscription;
