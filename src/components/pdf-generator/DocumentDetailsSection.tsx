import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFFormData, DOCUMENT_TYPES } from "@/types/pdf-generator";

interface DocumentDetailsSectionProps {
  formData: PDFFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function DocumentDetailsSection({ formData, errors, handleInputChange }: DocumentDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Document Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <select 
            id="documentType" 
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            {DOCUMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.documentType && (
            <p className="text-sm text-red-500">{errors.documentType}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="documentNumber">Document Number *</Label>
          <Input 
            id="documentNumber" 
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleInputChange}
            placeholder="Auto-generated" 
            className={errors.documentNumber ? "border-red-500" : ""}
            readOnly
          />
          {errors.documentNumber && (
            <p className="text-sm text-red-500">{errors.documentNumber}</p>
          )}
          <p className="text-xs text-muted-foreground">Document number is auto-generated</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="documentDate">Date *</Label>
          <Input 
            id="documentDate" 
            name="documentDate"
            type="date"
            value={formData.documentDate}
            onChange={handleInputChange}
            className={errors.documentDate ? "border-red-500" : ""}
          />
          {errors.documentDate && (
            <p className="text-sm text-red-500">{errors.documentDate}</p>
          )}
        </div>
      </div>
    </div>
  );
} 