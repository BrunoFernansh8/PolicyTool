const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  postcode: { type: String },
  role: { type: String, enum: ['superuser', 'user'], default: 'user' },
  organisationPassword: { type: String }, // For employees during sign-up
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);

