const { generatePolicyPDF } = require('../utils/pdfGenerator');
const Risk = require('../models/Risk');
const { generatePolicyContent } = require('../utils/gpt');

exports.generatePolicy = async (req, res) => {
  const { organization, riskIds } = req.body;

  try {
    if (!organization || !riskIds || riskIds.length === 0) {
      return res.status(400).json({ message: "Organisation and risk IDs are required." });
    }

    // Fetch risks from the database
    const risks = await Risk.find({ _id: { $in: riskIds } });

    if (!risks || risks.length === 0) {
      return res.status(404).json({ message: "No risks found for the provided IDs." });
    }

    // Generate structured policy content
    const policySections = await generatePolicyContent(risks, organization);

    // Debugging: Log policy sections
    console.log("Generated Policy Sections:", JSON.stringify(policySections, null, 2));

    if (!policySections || policySections.length === 0) {
      throw new Error("Generated policy content is empty.");
    }

    // Generate the PDF
    const filePath = await generatePolicyPDF(policySections, organization);
    
    // Send the file for download
    res.status(200).download(filePath, `${organization}_policy.pdf`);

  } catch (error) {
    console.error("Error generating policy:", error.message || error);
    res.status(500).json({ message: "Error generating policy." });
  }
};

// Handles policy submission without generation
exports.createPolicy = (req, res) => {
  const policyData = req.body;
  console.log('Policy data received:', policyData);
  res.status(201).send({ message: 'Policy requirements submitted successfully', data: policyData });
};
