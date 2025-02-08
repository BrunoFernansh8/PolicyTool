const mongoose = require('mongoose');

const RiskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    reportedBy: { type: String, required: true },
    organization: { type: String, required: true },
    research: { type: String, default: 'No research available.' }, // Updated default
    likelihood: { type: String, default: 'Unknown' }, // Updated default
    consequences: { type: String, default: 'Not specified.' }, // Added default
    mitigationStrategies: {
      type: Map,
      of: String,
      default: {}, // Default as an empty map
    },
    assetImpact: {
      userInformation: { type: String, default: 'No impact specified.' }, // Default added
      client: { type: String, default: 'No impact specified.' },
      system: { type: String, default: 'No impact specified.' },
      infrastructure: { type: String, default: 'No impact specified.' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Risk', RiskSchema);
