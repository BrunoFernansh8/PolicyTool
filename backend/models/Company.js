const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  superuser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Company', companySchema);
