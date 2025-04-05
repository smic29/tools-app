import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFFormData } from "@/types/pdf-generator";

interface ClientInfoSectionProps {
  formData: PDFFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function ClientInfoSection({ formData, errors, handleInputChange }: ClientInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Client Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <Input 
            id="clientName" 
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder="Enter client name" 
            className={errors.clientName ? "border-red-500" : ""}
          />
          {errors.clientName && (
            <p className="text-sm text-red-500">{errors.clientName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientAddress">Client Address</Label>
          <Input 
            id="clientAddress" 
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleInputChange}
            placeholder="Enter client address" 
          />
        </div>
      </div>
    </div>
  );
} 