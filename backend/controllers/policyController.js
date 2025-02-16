const { generatePolicyPDF } = require('../utils/pdfGenerator');
const Risk = require('../models/Risk');
const { generatePolicyContent } = require('../utils/gpt');

exports.generatePolicy = async (req, res) => {
  const { organization, riskIds } = req.body;

  try {
    if (!organization || !riskIds || riskIds.length === 0) {
      return res.status(400).json({ message: "Organization and risk IDs are required." });
    }

    // Fetch risks from the database using the provided risk IDs
    const risks = await Risk.find({ _id: { $in: riskIds } });

    if (!risks || risks.length === 0) {
      return res.status(404).json({ message: "No risks found for the provided IDs." });
    }

    // Prepare policy content
    const policyData = risks.map((risk, index) => ({
      title: `Risk ${index + 1}: ${risk.title}`,
      content: `
        Background Research: ${risk.backgroundResearch || "Not provided."} \n
        Likelihood: ${risk.likelihood || "Unknown."} \n
        Consequences: ${risk.consequences || "Not specified."} \n
        Mitigation Strategies: ${risk.mitigationStrategies || "Not specified."} \n
      `,
    }));

    // Generate the PDF file
    const filePath = await generatePolicyPDF(policyData, organization);

    // Send the PDF file for download
    res.status(200).download(filePath, `${organization}_policy.pdf`);
  } catch (error) {
    console.error("Error generating policy:", error.message || error);
    res.status(500).json({ message: "Error generating policy." });
  }
};

exports.createPolicy = (req, res) => {
  const policyData = req.body;
  console.log('Policy data received:', policyData);
  res.status(201).send({ message: 'Policy requirements submitted successfully', data: policyData });
};
