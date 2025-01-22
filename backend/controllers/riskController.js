const Risk = require('../models/Risk');
const { analyzeRisk } = require('../utils/gpt');

// Fetch logged risks
exports.getRisks = async (req, res) => {
  try {
    const risks = await Risk.find({ createdBy: req.user.id });
    res.status(200).json(risks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching risks.', error: err.message });
  }
};

// Add a new risk
exports.addRisk = async (req, res) => {
  const { title, description } = req.body;

  try {
    const risk = new Risk({ title, description, createdBy: req.user.id });
    await risk.save();
    res.status(201).json(risk);
  } catch (err) {
    res.status(500).json({ message: 'Error adding risk.', error: err.message });
  }
};

// Analyze concern using GPT
exports.analyzeConcern = async (req, res) => {
  const { concern } = req.body;

  if (!concern) {
    return res.status(400).json({ message: 'Concern description is required.' });
  }

  try {
    const analysis = await analyzeRisk(concern);
    res.status(200).json({ analyzedConcern: analysis });
  } catch (err) {
    res.status(500).json({ message: 'Error analysing concern.', error: err.message });
  }
};
