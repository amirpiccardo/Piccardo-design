const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  photo: { type: String, required: true },
  bio: { type: String, default: "" },
  linkedin: { type: String, default: "" },
});

module.exports = mongoose.model("TeamMember", teamMemberSchema);
