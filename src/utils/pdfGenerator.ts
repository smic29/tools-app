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
  
  // Add company information
  pdf.setFontSize(16);
  pdf.text(formData.companyName, 20, 20);
  
  pdf.setFontSize(10);
  pdf.text(formData.companyAddress, 20, 27);
  pdf.text(`Phone: ${formData.companyPhone}`, 20, 32);
  pdf.text(`Email: ${formData.companyEmail}`, 20, 37);
  pdf.text('NON-VAT Registration', 20, 42);
  
  // Add document type and details
  pdf.setFontSize(14);
  let documentTitle = "QUOTATION";
  if (formData.documentType === "billing_statement") {
    documentTitle = "BILLING STATEMENT";
  } else if (formData.documentType === "statement_of_account") {
    documentTitle = "STATEMENT OF ACCOUNT";
  }
  pdf.text(documentTitle, 150, 20, { align: 'right' });
  
  pdf.setFontSize(10);
  pdf.text(`No: ${formData.documentNumber}`, 150, 27, { align: 'right' });
  pdf.text(`Date: ${formData.documentDate}`, 150, 32, { align: 'right' });
  if (formData.documentType === "billing_statement" && formData.dueDate) {
    pdf.text(`Due Date: ${formData.dueDate}`, 150, 37, { align: 'right' });
  }
  
  // Add client information
  pdf.setFontSize(12);
  pdf.text('Bill To:', 20, 55);
  
  pdf.setFontSize(10);
  pdf.text(formData.clientName, 20, 62);
  pdf.text(formData.clientAddress, 20, 67);
  
  // Add items table
  pdf.setFontSize(12);
  pdf.text('Items', 20, 85);
  
  // Table headers
  pdf.setFontSize(10);
  pdf.text('Description', 20, 92);
  pdf.text('Quantity', 80, 92);
  pdf.text('Unit Price', 100, 92);
  pdf.text('Currency', 120, 92);
  pdf.text('Total (PHP)', 150, 92);
  
  // Table rows
  let yPos = 99;
  formData.items.forEach(item => {
    pdf.text(item.description, 20, yPos);
    pdf.text(item.quantity.toString(), 80, yPos);
    pdf.text(item.price.toFixed(2), 100, yPos);
    pdf.text(item.currency, 120, yPos);
    pdf.text(item.total.toFixed(2), 150, yPos);
    yPos += 7;
  });
  
  // Calculate total
  const total = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  
  // Total
  pdf.setFontSize(10);
  pdf.text('Total (PHP):', 120, yPos + 5);
  pdf.setFont('courier'); // Use monospace font for better alignment
  pdf.text(`₱ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 150, yPos + 5);
  pdf.setFont('helvetica'); // Reset to default font
  
  // Amount in words
  pdf.setFontSize(9);
  pdf.text('Amount in words:', 20, yPos + 12);
  pdf.setFontSize(8);
  const amountInWords = pesoToWords(total);
  const wordsLines = pdf.splitTextToSize(amountInWords, 170);
  pdf.text(wordsLines, 20, yPos + 18);
  
  // Notes
  if (formData.notes) {
    pdf.setFontSize(12);
    pdf.text('Notes:', 20, yPos + 12 + (wordsLines.length * 5));
    
    pdf.setFontSize(10);
    const notesLines = pdf.splitTextToSize(formData.notes, 170);
    pdf.text(notesLines, 20, yPos + 18 + (wordsLines.length * 5));
  }
  
  // Footer
  pdf.setFontSize(10);
  pdf.text('Thank you for your business!', 105, 270, { align: 'center' });
  
  // Save the PDF
  const fileName = `${formData.documentType}-${formData.documentNumber || 'document'}.pdf`;
  pdf.save(fileName);
} 