import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFFormData } from "@/types/pdf-generator";
import React from "react";
import { Button } from "../ui/button";
import { Building2, LockOpenIcon, Mail, MapPin, Phone, UserCheck } from "lucide-react";
import Image from "next/image";

interface CompanyInfoSectionProps {
  formData: PDFFormData;
  onCompanyKeyInput: (data: Partial<PDFFormData>) => void;
}

export function CompanyInfoSection({ 
  formData, 
  onCompanyKeyInput: handleCompanyKeyInput
 }: CompanyInfoSectionProps) {
  const [companyKeyInput, setCompanyKeyInput] = React.useState("");
  const [invalidKey, setInvalidKey] = React.useState(false);
  
  const defaultInputClass = "w-full mt-2 p-2 border rounded-md";
  const clientDatabase: Record<string, Partial<PDFFormData>> = {
    "RBSIBULO": { 
      companyName: "RBSibulo Logistics Services",
      companyAddress: "#8 road 5C cor. 9th St., UPS V, Brgy. San Isidro, Parañaque 1700",
      companyPhone: "0912 980 1532",
      companyEmail: "rogemae.sibulo@gmail.com",
      companyLogo: "/companyLogos/rbsibulo.png",
      companyisNonVat: true,
      companyTin: "501-594-979-000",
      companyAuthRep: "Rogemae Sibulo",
    },
    "TEST": {
      companyName: "Test Company",
      companyAddress: "123 Main St, Anytown, USA",
      companyPhone: "123-456-7890",
      companyEmail: "w0D3o@example.com",
      companyisNonVat: false,
      companyTin: "123-456-789",
      companyAuthRep: "John Doe",
    }
  };

  const handleUnlockClick = () => {
    const companyData = clientDatabase[companyKeyInput] || clientDatabase.TEST;

    handleCompanyKeyInput(companyData);

    setInvalidKey(companyKeyInput !== "" && !clientDatabase[companyKeyInput]);
  }

  return (
    <div className="space-y-4">
      {formData.companyName ? (
        <div className="flex flex-col space-y-1 text-sm">
          {formData.companyLogo && (
            <div className="flex justify-center mt-4">
              <Image 
                src={formData.companyLogo} 
                alt={`${formData.companyName} Logo`} 
                width={128} // Adjust as needed
                height={128} // Adjust as needed
                className="object-contain"
              />
            </div>
          )}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="font-semibold">{formData.companyName}</span>
        </div>
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
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-gray-500" />
          <span>{formData.companyAuthRep}</span>
        </div>
      </div>
      ) : (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor="companyKey">Company Key</Label>
            <Input 
              id="companyKey" 
              name="companyKey"
              value={companyKeyInput}
              onChange={(e) => setCompanyKeyInput(e.target.value)}
              placeholder="Enter company key" 
              className={invalidKey ? `${defaultInputClass} border-red-500` : defaultInputClass}
            />
          </div>
          <Button type="button" onClick={handleUnlockClick}>
            <LockOpenIcon className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
} 