const mongoose = require("mongoose");

const RiskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    reportedBy: { type: String, required: true },
    organization: { type: String, required: true },
    backgroundResearch: { type: String, default: "No research available." },
    likelihood: { type: String, default: "Unknown" },
    consequences: { type: String, default: "Not specified." },
    mitigationStrategies: { type: String, default: "Not Specified." },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Risk", RiskSchema);
