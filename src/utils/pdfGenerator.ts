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
  
  // Add horizontal line
  pdf.setLineWidth(0.2);
  pdf.line(20, 45, 190, 45);
  
  // Create a box for client and document details
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.rect(20, 50, 170, 25);
  
  // Add vertical line to separate client and document details
  pdf.line(105, 50, 105, 75);
  
  // Add client information
  pdf.setFontSize(12);
  pdf.text('Bill To:', 25, 58);
  
  pdf.setFontSize(10);
  pdf.text(formData.clientName, 25, 65);
  pdf.text(formData.clientAddress, 25, 70);
  
  // Add document details on the right side
  pdf.setFontSize(12);
  pdf.text('Document Details:', 110, 58);
  
  pdf.setFontSize(10);
  pdf.text(`Type: ${documentTitle}`, 110, 65);
  pdf.text(`Number: ${formData.documentNumber}`, 110, 70);
  
  // Add horizontal line
  pdf.line(20, 80, 190, 80);
  
  // Add items table
  pdf.setFontSize(12);
  pdf.text('Items', 20, 90);
  
  // Table headers with background
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, 93, 170, 7, 'F');
  
  pdf.setFontSize(10);
  pdf.text('Description', 25, 97);
  pdf.text('Quantity', 85, 97);
  pdf.text('Unit Price', 105, 97);
  pdf.text('Currency', 125, 97);
  pdf.text('Total (PHP)', 150, 97);
  
  // Table rows with alternating background
  let yPos = 104;
  formData.items.forEach((item, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(20, yPos - 4, 170, 7, 'F');
    }
    
    pdf.text(item.description, 25, yPos);
    pdf.text(item.quantity.toString(), 85, yPos);
    pdf.text(item.price.toFixed(2), 105, yPos);
    pdf.text(item.currency, 125, yPos);
    pdf.text(item.total.toFixed(2), 150, yPos);
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
  pdf.text('Total (PHP):', 120, yPos + 5);
  
  // Use a different approach for the Peso symbol
  // Instead of using the Unicode character, we'll use a custom approach
  pdf.setFont('helvetica', 'bold');
  pdf.text('P', 145, yPos + 5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('HP', 147, yPos + 5);
  
  pdf.setFont('courier'); // Use monospace font for better alignment
  pdf.text(total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 155, yPos + 5);
  pdf.setFont('helvetica'); // Reset to default font
  
  // Amount in words on the same line
  pdf.setFontSize(9);
  const amountInWords = pesoToWords(total);
  const wordsLines = pdf.splitTextToSize(amountInWords, 100);
  pdf.text(wordsLines, 25, yPos + 5);
  
  // Notes with border
  if (formData.notes) {
    const notesY = yPos + 15;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.rect(20, notesY, 170, 15);
    
    pdf.setFontSize(12);
    pdf.text('Notes:', 25, notesY + 4);
    
    pdf.setFontSize(10);
    const notesLines = pdf.splitTextToSize(formData.notes, 160);
    pdf.text(notesLines, 25, notesY + 10);
  }
  
  // Footer with border
  const footerY = 260;
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.rect(20, footerY, 170, 15);
  
  pdf.setFontSize(10);
  pdf.text('Thank you for your business!', 105, footerY + 8, { align: 'center' });
  
  // Save the PDF
  const fileName = `${formData.documentType}-${formData.documentNumber || 'document'}.pdf`;
  pdf.save(fileName);
} 