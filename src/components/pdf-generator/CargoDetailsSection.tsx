import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PDFFormData } from "@/types/pdf-generator";

interface CargoDetailsSectionProps {
  formData: PDFFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CargoDetailsSection({
  formData,
  errors,
  handleInputChange,
}: CargoDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Cargo Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="portOfDischarge">Port of Discharge</Label>
          <Input
            id="portOfDischarge"
            name="portOfDischarge"
            value={formData.portOfDischarge || ""}
            onChange={handleInputChange}
            className={errors.portOfDischarge ? "border-red-500" : ""}
          />
          {errors.portOfDischarge && (
            <p className="text-sm text-red-500">{errors.portOfDischarge}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="portOfLoading">Port of Loading</Label>
          <Input
            id="portOfLoading"
            name="portOfLoading"
            value={formData.portOfLoading || ""}
            onChange={handleInputChange}
            className={errors.portOfLoading ? "border-red-500" : ""}
          />
          {errors.portOfLoading && (
            <p className="text-sm text-red-500">{errors.portOfLoading}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vesselVoyage">Vessel/Voyage</Label>
          <Input
            id="vesselVoyage"
            name="vesselVoyage"
            value={formData.vesselVoyage || ""}
            onChange={handleInputChange}
            className={errors.vesselVoyage ? "border-red-500" : ""}
          />
          {errors.vesselVoyage && (
            <p className="text-sm text-red-500">{errors.vesselVoyage}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="billOfLadingNo">Bill of Lading No.</Label>
          <Input
            id="billOfLadingNo"
            name="billOfLadingNo"
            value={formData.billOfLadingNo || ""}
            onChange={handleInputChange}
            className={errors.billOfLadingNo ? "border-red-500" : ""}
          />
          {errors.billOfLadingNo && (
            <p className="text-sm text-red-500">{errors.billOfLadingNo}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="eta">ETA</Label>
          <Input
            id="eta"
            name="eta"
            type="date"
            value={formData.eta || ""}
            onChange={handleInputChange}
            className={errors.eta ? "border-red-500" : ""}
          />
          {errors.eta && (
            <p className="text-sm text-red-500">{errors.eta}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription || ""}
            onChange={handleInputChange}
            className={errors.jobDescription ? "border-red-500" : ""}
            rows={3}
          />
          {errors.jobDescription && (
            <p className="text-sm text-red-500">{errors.jobDescription}</p>
          )}
        </div>
      </div>
    </div>
  );
} 