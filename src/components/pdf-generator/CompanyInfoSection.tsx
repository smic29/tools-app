import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFFormData } from "@/types/pdf-generator";

interface CompanyInfoSectionProps {
  formData: PDFFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function CompanyInfoSection({ formData, errors, handleInputChange }: CompanyInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Company Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input 
            id="companyName" 
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name" 
            className={errors.companyName ? "border-red-500" : ""}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Company Address *</Label>
          <Input 
            id="companyAddress" 
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleInputChange}
            placeholder="Enter company address" 
            className={errors.companyAddress ? "border-red-500" : ""}
          />
          {errors.companyAddress && (
            <p className="text-sm text-red-500">{errors.companyAddress}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Phone Number</Label>
          <Input 
            id="companyPhone" 
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleInputChange}
            placeholder="Enter phone number" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyEmail">Email</Label>
          <Input 
            id="companyEmail" 
            name="companyEmail"
            type="email"
            value={formData.companyEmail}
            onChange={handleInputChange}
            placeholder="Enter email address" 
          />
        </div>
      </div>
    </div>
  );
} 