const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  description: String,
  likelihood: String,
  consequence: String,
  company: String,
  createdBy: String,
});

module.exports = mongoose.model('Risk', riskSchema);
