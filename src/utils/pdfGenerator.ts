import jsPDF from "jspdf";
import { PDFFormData } from "@/types/pdf-generator";
import { pesoToWords } from "./numberToWords";

/**
 * Generates a PDF document from the form data
 * @param formData The form data to generate the PDF from
 * @returns A promise that resolves when the PDF is generated
 */
export async function generatePDF(formData: PDFFormData): Promise<void> {
  // Create PDF directly with jsPDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set font
  pdf.setFont('helvetica');
  
  // Add border to the page
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.rect(10, 10, 190, 277); // Outer border

  // Check Logo existence
  const hasLogo = formData.companyLogo?.trim() !== '';

  // Set positions
  const logoX = 10;
  const logoY = 10;
  const logoWidth = 40;
  const logoHeight = 40;
  const textX = hasLogo ? logoX + logoWidth - 5 : 20;
  const textY = hasLogo ? logoY + 10 : 20;

  // Add logo
  if (hasLogo) {
    const logo = new Image();
    logo.src = formData.companyLogo;
    pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
  }

  // Add company information
  pdf.setFontSize(16);
  pdf.text(formData.companyName, textX, textY);
  
  pdf.setFontSize(10);
  pdf.text(formData.companyAddress, textX, textY + 7);
  pdf.text(`Phone: ${formData.companyPhone}`, textX, textY + 12);
  pdf.text(`Email: ${formData.companyEmail}`, textX, textY + 17);
  pdf.text(`${formData.companyisNonVat ? 'NON-VAT' : 'VAT'} Reg. TIN # ${formData.companyTin}`, textX, textY + 22);
  
  // Create a box for client and document details
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.rect(20, 50, 170, 25);
  
  // Add vertical line to separate client and document details
  pdf.line(105, 50, 105, 75);

  // Set Document Title
  let documentTitle = "QUOTATION";
  if (formData.documentType === "invoice") {
    documentTitle = "INVOICE";
  } else if (formData.documentType === "statement_of_account") {
    documentTitle = "STATEMENT OF ACCOUNT";
  }
  
  // Add client information
  pdf.setFontSize(12);
  pdf.text(`To :`, 25, 58);
  
  pdf.setFontSize(10);
  pdf.text(formData.clientName, 25, 65);
  pdf.text(formData.clientAddress, 25, 70);
  
  // Add document details on the right side
  pdf.setFontSize(12);
  pdf.text(documentTitle, 110, 58);
  
  pdf.setFontSize(10);
  pdf.text(`Ref: ${formData.documentNumber}`, 110, 65);
  pdf.text(`Date: ${formData.documentDate}`, 110, 70  );
  
  // Add horizontal line
  pdf.line(20, 80, 190, 80);
  
  // Variable to track vertical position
  let yPos = 90;
  
  // Add cargo details if available
  if (formData.portOfDischarge || formData.portOfLoading || formData.vesselVoyage || 
      formData.billOfLadingNo || formData.eta || formData.jobDescription) {
    pdf.setFontSize(12);
    pdf.text('Cargo Details', 20, yPos);
    
    // Table headers with background
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, yPos + 3, 170, 7, 'F');
    
    pdf.setFontSize(10);
    pdf.text('Port of Discharge', 25, yPos + 7);
    pdf.text('Port of Loading', 85, yPos + 7);
    pdf.text('Vessel/Voyage', 125, yPos + 7);
    
    // Table row with alternating background
    pdf.setFillColor(248, 248, 248);
    pdf.rect(20, yPos + 10, 170, 7, 'F');
    
    pdf.text(formData.portOfDischarge || '-', 25, yPos + 14);
    pdf.text(formData.portOfLoading || '-', 85, yPos + 14);
    pdf.text(formData.vesselVoyage || '-', 125, yPos + 14);
    
    // Second row
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, yPos + 17, 170, 7, 'F');
    
    pdf.text('Bill of Lading No.', 25, yPos + 21);
    pdf.text('ETA', 85, yPos + 21);
    
    // Table row with alternating background
    pdf.setFillColor(248, 248, 248);
    pdf.rect(20, yPos + 24, 170, 7, 'F');
    
    pdf.text(formData.billOfLadingNo || '-', 25, yPos + 28);
    pdf.text(formData.eta || '-', 85, yPos + 28);
    
    // Job Description
    if (formData.jobDescription) {
      yPos += 40;
      pdf.setFontSize(12);
      pdf.text('Job Description', 20, yPos);
      
      pdf.setFontSize(10);
      const jobDescriptionLines = pdf.splitTextToSize(formData.jobDescription, 170);
      pdf.text(jobDescriptionLines, 20, yPos + 7);
      
      // Add horizontal line after job description
      pdf.line(20, yPos + 7 + (jobDescriptionLines.length * 5), 190, yPos + 7 + (jobDescriptionLines.length * 5));
      
      // Adjust the starting position for the items table
      yPos += 7 + (jobDescriptionLines.length * 5) + 10;
    } else {
      // If no job description, start the items table at a fixed position
      yPos += 40;
    }
  }
  
  // Add items table
  pdf.setFontSize(12);
  pdf.text('Items', 20, yPos);
  
  // Table headers with background
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPos + 3, 170, 7, 'F');
  
  pdf.setFontSize(10);
  pdf.text('Description', 25, yPos + 7);
  pdf.text('Quantity', 85, yPos + 7);
  pdf.text('Unit Price', 105, yPos + 7);
  pdf.text('Currency', 125, yPos + 7);
  pdf.text('Total (PHP)', 150, yPos + 7);
  
  // Table rows with alternating background
  yPos += 14;
  formData.items.forEach((item, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(20, yPos - 4, 170, 7, 'F');
    }
    
    pdf.text(item.description, 25, yPos);
    pdf.text(item.quantity.toString(), 85, yPos);
    pdf.text(item.price.toFixed(2), 105, yPos);
    pdf.text(item.currency, 125, yPos);
    pdf.text(item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 150, yPos);
    yPos += 7;
  });
  
  // Add horizontal line for total
  pdf.setLineWidth(0.2);
  pdf.line(20, yPos - 2, 190, yPos - 2);
  
  // Calculate total
  const total = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  
  // Total with background and amount in words on the same line
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPos, 170, 10, 'F');
  
  pdf.setFontSize(10);
  pdf.text('Total:', 120, yPos + 5);
  
  // Use a different approach for the Peso symbol
  // Instead of using the Unicode character, we'll use a custom approach
  pdf.setFont('helvetica', 'bold');
  pdf.text('P', 145, yPos + 5);
  
  pdf.setFont('courier'); // Use monospace font for better alignment
  pdf.text(total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 155, yPos + 5);
  pdf.setFont('helvetica'); // Reset to default font
  
  // Amount in words on the same line
  pdf.setFontSize(9);
  const amountInWords = pesoToWords(total);
  const wordsLines = pdf.splitTextToSize(amountInWords, 100);
  pdf.text(wordsLines, 25, yPos + 5);
  
  // Footer with border
  const footerY = 260;
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.rect(20, footerY, 170, 8);
  
  pdf.setFontSize(8);
  const lastLineText = documentTitle === 'QUOTATION' ?  `Approved by: ${formData.companyAuthRep}` : 'This is not valid for input tax claim';
  pdf.text(lastLineText, 105, footerY + 5, { align: 'center' });
  
  // Save the PDF
  const fileName = `${formData.documentNumber || 'document'}.pdf`;
  pdf.save(fileName);
} 