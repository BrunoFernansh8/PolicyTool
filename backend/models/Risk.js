const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  likelihood: { type: String },
  consequence: { type: String },
  priority: { type: Number }, 
  reportedBy: { type: String},
});

module.exports = mongoose.model('Risk', riskSchema);
