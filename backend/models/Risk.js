const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  likelihood: { type: String },
  consequence: { type: String },
  priority: { type: Number }, // Dragging for priority listing
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Risk', riskSchema);
