import { Button } from "@/components/ui/button";
import { PDFFormData } from "@/types/pdf-generator";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

interface PreviewSectionProps {
  formData: PDFFormData;
  calculateTotal: () => number;
  getAmountInWords: () => string;
  handleBack: () => void;
  handlePrint: () => void;
  handleGeneratePDF: () => void;
  isGenerating: boolean;
}

export function PreviewSection({
  formData,
  calculateTotal,
  getAmountInWords,
  handleBack,
  handlePrint,
  handleGeneratePDF,
  isGenerating
}: PreviewSectionProps) {
  return (
    <div className="border p-6 space-y-6 print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Image src={formData.companyLogo} alt="Company Logo" width={150} height={150} />
          <div>
            <h2 className="text-2xl font-bold">{formData.companyName}</h2>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{formData.companyAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{formData.companyPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{formData.companyEmail}</span>
            </div>
            <p className="text-sm mt-2">NON-VAT Registration</p>
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-xl font-bold uppercase">
            {formData.documentType === 'quotation' ? 'QUOTATION' : 
             formData.documentType === 'invoice' ? 'INVOICE' : 
             'STATEMENT OF ACCOUNT'}
          </h1>
          <p className="text-sm">No: {formData.documentNumber}</p>
          <p className="text-sm">Date: {formData.documentDate}</p>
          {formData.documentType === "invoice" && formData.dueDate && (
            <p className="text-sm">Due Date: {formData.dueDate}</p>
          )}
        </div>
      </div>

      {/* Client Info */}
      <div className="mt-6">
        <h3 className="font-medium">Bill To:</h3>
        <p>{formData.clientName}</p>
        <p>{formData.clientAddress}</p>
      </div>

      {/* Cargo Details */}
      {(formData.portOfDischarge || formData.portOfLoading || formData.vesselVoyage || 
        formData.billOfLadingNo || formData.eta || formData.jobDescription) && (
        <div className="mt-6">
          <h3 className="font-medium">Cargo Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Port of Discharge</p>
              <p>{formData.portOfDischarge || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Port of Loading</p>
              <p>{formData.portOfLoading || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vessel/Voyage</p>
              <p>{formData.vesselVoyage || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bill of Lading No.</p>
              <p>{formData.billOfLadingNo || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ETA</p>
              <p>{formData.eta || '-'}</p>
            </div>
          </div>
          
          {formData.jobDescription && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Job Description</p>
              <p className="whitespace-pre-line">{formData.jobDescription}</p>
            </div>
          )}
        </div>
      )}

      {/* Items Table */}
      <div className="mt-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-center py-2">Quantity</th>
              <th className="text-center py-2">Unit Price</th>
              <th className="text-center py-2">Currency</th>
              <th className="text-center py-2">Total (PHP)</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-center">{item.price.toFixed(2)}</td>
                <td className="text-center">{item.currency}</td>
                <td className="text-center font-mono">
                  <div className="flex justify-center">
                    <span className="text-muted-foreground mr-1">₱</span>
                    <span>{item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td colSpan={4} className="py-2">
                <div className="text-sm uppercase">
                  {getAmountInWords()}
                </div>
              </td>
              <td className="text-center py-2 font-mono">
                <div className="flex justify-center">
                  <span className="text-muted-foreground mr-1">₱</span>
                  <span>{calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm">
        <p>Thank you for your business!</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6 print:hidden">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back to Form
        </Button>
        <Button type="button" onClick={handlePrint}>
          Print
        </Button>
        <Button 
          type="button" 
          onClick={handleGeneratePDF}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate PDF"}
        </Button>
      </div>
    </div>
  );
} 