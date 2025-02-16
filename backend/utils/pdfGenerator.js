const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePolicyPDF = (policyData, organization) => {
  if (!policyData || !Array.isArray(policyData)) {
    throw new Error("Invalid policy data: Must be a non-empty array.");
  }

  const doc = new PDFDocument();
  const fileName = `./policies/${organization}_policy_${Date.now()}.pdf`;

  // Create the policies directory if it does not exist
  if (!fs.existsSync('./policies')) {
    fs.mkdirSync('./policies');
  }

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(fileName);
    doc.pipe(writeStream);

    // Add title to the PDF
    doc.fontSize(20).text(`Security Policy for ${organization}`, { align: 'center' });
    doc.moveDown();

    // Loop through policyData and add content
    policyData.forEach((section, index) => {
      if (!section || !section.title || !section.content) {
        throw new Error(`Invalid policy section at index ${index}`);
      }
      doc.fontSize(16).text(`Section ${index + 1}: ${section.title}`, { underline: true });
      doc.fontSize(12).text(section.content, { align: 'justify' });
      doc.moveDown();
    });

    doc.end();

    writeStream.on('finish', () => resolve(fileName));
    writeStream.on('error', (err) => reject(err));
  });
};
