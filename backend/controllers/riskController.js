const Risk = require('../models/Risk');
const { analyzeRisk } = require('../utils/gpt');

/**
 * Fetch all risks associated with the user's organization.
 */
const getRisks = async (req, res) => {
  try {
    const { title, organization } = req.query; // Extract query parameters

    // Construct a query object to search by title & organization
    let query = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") }; // Case-insensitive title search
    }

    if (organization) {
      query.organization = { $regex: new RegExp(organization, "i") }; // Case-insensitive organization search
    }

    // Fetch risks with all relevant fields
    const risks = await Risk.find(query).select('-__v'); // Excludes MongoDB version key

    if (risks.length === 0) {
      return res.status(404).json({ message: "No risks found for this title and organization." });
    }

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

    // Update the risk fields with the generated analysis
    risk.backgroundResearch = analysis.backgroundResearch || "No research available.";
    risk.likelihood = analysis.likelihood || "Unknown";
    risk.consequences = analysis.consequences || "Not specified.";
    risk.mitigationStrategies = analysis.mitigationStrategies || "Not specified.";

    console.log("Updating Risk Fields:", {
      backgroundResearch: analysis.backgroundResearch,
      likelihood: analysis.likelihood,
      consequences: analysis.consequences,
      mitigationStrategies: analysis.mitigationStrategies,
    });
    
    // Save the updated risk back to the database
    const updatedRisk = await risk.save();

    console.log("Updated Risk:", updatedRisk);

    res.status(200).json({
      message: "Risk analyzed successfully!",
      analyzedRisk: updatedRisk,
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
