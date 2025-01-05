const Risk = require('../models/Risk');

exports.getRisks = async (req, res) => {
  try {
    const risks = await Risk.find({ createdBy: req.user.id });
    res.status(200).json(risks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching risks.', error: err.message });
  }
};

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
