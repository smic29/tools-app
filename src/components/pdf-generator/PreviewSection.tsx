import { Button } from "@/components/ui/button";
import { PDFFormData } from "@/types/pdf-generator";

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
        <div>
          <h2 className="text-2xl font-bold">{formData.companyName}</h2>
          <p className="text-sm">{formData.companyAddress}</p>
          <p className="text-sm">Phone: {formData.companyPhone}</p>
          <p className="text-sm">Email: {formData.companyEmail}</p>
          <p className="text-sm mt-2">NON-VAT Registration</p>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold uppercase">
            {formData.documentType === 'quotation' ? 'QUOTATION' : 
             formData.documentType === 'billing_statement' ? 'BILLING STATEMENT' : 
             'STATEMENT OF ACCOUNT'}
          </h1>
          <p className="text-sm">No: {formData.documentNumber}</p>
          <p className="text-sm">Date: {formData.documentDate}</p>
          {formData.documentType === "billing_statement" && formData.dueDate && (
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

      {/* Notes */}
      {formData.notes && (
        <div className="mt-6">
          <h3 className="font-medium">Notes:</h3>
          <p className="whitespace-pre-line">{formData.notes}</p>
        </div>
      )}

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