
const { generatePolicyPDF } = require('../utils/pdfGenerator');
const fs = require('fs');

exports.createPolicy = async (req, res) => {
  const { concerns, companyName } = req.body;

  try {
    // Simulate policy creation using GPT or templates
    const policyData = concerns.map((concern, index) => ({
      title: `Policy for Concern: ${concern.title}`,
      content: `Mitigation strategy for ${concern.description}: ${concern.mitigation}`,
    }));

    const pdfFilePath = await generatePolicyPDF(policyData, companyName);

    res.status(200).json({
      message: 'Policy created successfully!',
      downloadLink: `/api/policy/download?file=${encodeURIComponent(pdfFilePath)}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate policy PDF.' });
  }
};

// Serve PDF file for download
exports.downloadPolicy = async (req, res) => {
  const { file } = req.query;

  if (fs.existsSync(file)) {
    res.download(file);
  } else {
    res.status(404).json({ error: 'File not found.' });
  }
};
