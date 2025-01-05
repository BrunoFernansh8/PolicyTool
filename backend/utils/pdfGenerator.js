const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePolicyPDF = (policyData, companyName) => {
  const doc = new PDFDocument();
  const fileName = `./policies/${companyName}_policy_${Date.now()}.pdf`;

  if (!fs.existsSync('./policies')) {
    fs.mkdirSync('./policies');
  }

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(fileName);
    doc.pipe(writeStream);

    // Add content to the PDF
    doc.fontSize(20).text(`Cloud Security Policy for ${companyName}`, { align: 'center' });
    doc.moveDown();

    policyData.forEach((section, index) => {
      doc.fontSize(16).text(`Section ${index + 1}: ${section.title}`, { underline: true });
      doc.fontSize(12).text(section.content, { align: 'justify' });
      doc.moveDown();
    });

    doc.end();

    writeStream.on('finish', () => resolve(fileName));
    writeStream.on('error', (err) => reject(err));
  });
};
