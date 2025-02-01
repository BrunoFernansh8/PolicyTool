const Risk = require('../models/Risk');
const { analyzeRisk } = require('../utils/gpt');

/**
 * Fetch all risks associated with the user's organization.
 */
const getRisks = async (req, res) => {
  try {
    // Assuming the organization is identified via req.user.organizationId
    const organizationId = req.user.organizationId;
    
    // Fetch risks related to the organization
    const risks = await Risk.find({ organization: organizationId });
    res.status(200).json(risks);
  } catch (error) {
    console.error('Error fetching risks:', error);
    res.status(500).json({ message: 'Failed to fetch risks.' });
  }
};

/**
 * Add a new risk to the organization's database.
 */
const addRisk = async (req, res) => {
  try {
    const { title, description, reportedBy } = req.body;

    // Validate required fields
    if (!title || !description || !reportedBy) {
      return res.status(400).json({ message: 'Title, description, and reporter are required.' });
    }

    // Create and save the new risk
    const newRisk = new Risk({
      title,
      description,
      reportedBy,
      organization: req.user.organizationId // Link to user's organization
    });

    await newRisk.save();
    res.status(201).json(newRisk);
  } catch (error) {
    console.error('Error adding new risk:', error);
    res.status(500).json({ message: 'Failed to add risk.' });
  }
};

/**
 * Analyze a security concern using Hugging Face's NLP model.
 */
const analyzeConcern = async (req, res) => {
  try {
    const { concern } = req.body;

    // Validate input
    if (!concern) {
      return res.status(400).json({ message: 'Concern description is required.' });
    }

    // Analyze the concern
    const analysis = await analyzeRisk(concern);

    // Log the analysis result
    console.log('Analysis Result:', analysis);

    res.status(200).json({ analyzedConcern: analysis });
  } catch (error) {
    console.error('Error analyzing concern:', error);
    res.status(500).json({
      message: 'Error analyzing concern.',
      error: error.message || 'Internal Server Error'
    });
  }
};

module.exports = {
  getRisks,
  addRisk,
  analyzeConcern
};
