const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePolicyPDF = async (policyData, organization) => {
  if (!policyData || !Array.isArray(policyData) || policyData.length === 0) {
    throw new Error("Invalid policy data: Must be a non-empty array.");
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, left: 50, right: 50, bottom: 50 } });
    const fileName = `./policies/${organization}_policy_${Date.now()}.pdf`;

    // Ensure policies directory exists
    if (!fs.existsSync('./policies')) {
      fs.mkdirSync('./policies', { recursive: true });
    }

    const writeStream = fs.createWriteStream(fileName);
    doc.pipe(writeStream);

    try {
      // Title
      doc.font('Helvetica-Bold').fontSize(22).text(`Security Policy for ${organization}`, { align: 'center' });
      doc.moveDown(2);

      // Loop through policy sections
      policyData.forEach((section, index) => {
        if (!section || !section.title || !section.content) {
          console.warn(`Skipping invalid section at index ${index}`);
          return;
        }

        // Section Title - Bold & Underlined
        doc.font('Helvetica-Bold').fontSize(16).text(`${index + 1}. ${section.title}`, { underline: true });
        doc.moveDown(0.5);

        // Content Formatting
        doc.font('Helvetica').fontSize(12).text(section.content, { align: 'justify' });
        doc.moveDown(1);
      });

      // Finalize the PDF
      doc.end();

      writeStream.on('finish', () => {
        console.log(" PDF successfully generated:", fileName);
        resolve(fileName);
      });

      writeStream.on('error', (err) => {
        console.error(" PDF writing error:", err);
        reject(new Error("Failed to write PDF file."));
      });

    } catch (err) {
      console.error(" Error while generating PDF:", err);
      reject(new Error("Error while generating PDF content."));
    }
  });
};
