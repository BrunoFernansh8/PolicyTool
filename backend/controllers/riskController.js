const Risk = require('../models/Risk');
const { analyzeRisk } = require('../utils/gpt');

/**
 * Fetch all risks associated with the user's organization.
 */
const getRisks = async (req, res) => {
  try {
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
    const { title, description, reportedBy, organization } = req.body;

    // Validate required fields
    if (!title || !description || !reportedBy || !organization) {
      return res.status(400).json({ message: 'Title, description, reportedBy and organisation name are required.' });
    }

    // Create and save the new risk
    const newRisk = new Risk({
      title,
      description,
      reportedBy,
      organization,
    });

    await newRisk.save();
    res.status(201).json(newRisk);
  } catch (error) {
    console.error('Error adding new risk:', error);
    res.status(500).json({ message: 'Failed to add risk.' });
  }
};

/**
 * Analyze a stored risk by its ID.
 */
const analyzeStoredRiskById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Risk ID is required for analysis.' });
    }

    const risk = await Risk.findById(id);

    if (!risk) {
      return res.status(404).json({ message: 'Risk not found.' });
    }

    console.log('Found Risk:', risk);

    const analysis = await analyzeRisk(risk.title, risk.description);

    console.log('Analysis Result:', analysis);

    // Update the database record with the analysis
    risk.research = analysis.research;
    risk.likelihood = analysis.likelihood;
    risk.consequences = analysis.consequences;
    risk.mitigationStrategies = analysis.mitigationStrategies;
    risk.assetImpact = analysis.assetImpact;

    await risk.save();

    console.log('Updated Risk:', risk);

    res.status(200).json({
      message: 'Risk analyzed successfully!',
      analyzedRisk: risk,
    });
  } catch (error) {
    console.error('Error analyzing stored risk:', error.message || error);
    res.status(500).json({ message: 'Error analyzing stored risk.' });
    
  }
};
const deleteRisk = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the risk exists
    const risk = await Risk.findById(id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found.' });
    }

    // Delete the risk
    await Risk.findByIdAndDelete(id);
    res.status(200).json({ message: 'Risk deleted successfully.' });
  } catch (error) {
    console.error('Error deleting risk:', error);
    res.status(500).json({ message: 'Failed to delete risk.' });
  }
};

module.exports = {
  getRisks,
  addRisk,
  analyzeStoredRiskById,
  deleteRisk,
};
