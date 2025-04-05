import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFFormData } from "@/types/pdf-generator";
import { toast } from "sonner";

interface ExchangeRateSectionProps {
  formData: PDFFormData;
  updateDefaultExchangeRate: (rate: number) => void;
}

export function ExchangeRateSection({ formData, updateDefaultExchangeRate }: ExchangeRateSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Default Exchange Rate</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="defaultExchangeRate">USD to PHP Exchange Rate</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="defaultExchangeRate" 
              name="defaultExchangeRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.defaultExchangeRate || 55.0}
              onChange={(e) => updateDefaultExchangeRate(Number(e.target.value))}
              placeholder="Enter exchange rate" 
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                // Save the current exchange rate to localStorage
                localStorage.setItem('defaultExchangeRate', (formData.defaultExchangeRate || 55.0).toString());
                toast.success("Default exchange rate saved");
              }}
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This rate will be used for all USD items. Save it to use it in future sessions.
          </p>
        </div>
      </div>
    </div>
  );
} 