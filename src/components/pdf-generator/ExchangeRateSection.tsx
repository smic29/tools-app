import { Button } from "@/components/ui/button";
import { PDFFormData } from "@/types/pdf-generator";

interface ExchangeRateSectionProps {
  formData: PDFFormData;
  updateDefaultExchangeRate: (rate: number) => void;
}

export function ExchangeRateSection({
  formData,
  updateDefaultExchangeRate
}: ExchangeRateSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Default Exchange Rate (USD to PHP)</label>
        <div className="flex items-center mt-1">
          <input
            type="number"
            name="defaultExchangeRate"
            value={formData.defaultExchangeRate}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                updateDefaultExchangeRate(value);
              }
            }}
            step="0.01"
            min="0"
            className="w-full p-2 border rounded-md"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={() => updateDefaultExchangeRate(formData.defaultExchangeRate)}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
} 