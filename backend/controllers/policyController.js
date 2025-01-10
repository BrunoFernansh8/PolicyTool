const { generatePolicyPDF } = require('../utils/pdfGenerator');

// Generate policy and create PDF
exports.generatePolicy = async (req, res) => {
  const { companyName, risks } = req.body;

  try {
    // Sample mitigation strategies for demonstration
    const mitigations = risks.map((risk) => ({
      risk: risk.title,
      strategy: `Mitigation strategy for ${risk.title}`,
    }));

    const filePath = `./reports/${companyName}_policy.pdf`;

    // Generate PDF
    generatePolicyPDF({ companyName, risks, mitigations }, filePath);

    res.status(200).download(filePath, `${companyName}_policy.pdf`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating policy' });
  }
};
