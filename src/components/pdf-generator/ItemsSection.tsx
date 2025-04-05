import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PDFFormData, CURRENCY_OPTIONS } from "@/types/pdf-generator";

interface ItemsSectionProps {
  formData: PDFFormData;
  errors: Record<string, string>;
  handleItemChange: (index: number, field: string, value: string | number) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  calculateTotal: () => number;
}

export function ItemsSection({ 
  formData, 
  errors, 
  handleItemChange, 
  addItem, 
  removeItem,
  calculateTotal
}: ItemsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Items</h3>
      {errors.items && (
        <p className="text-sm text-red-500">{errors.items}</p>
      )}
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Description</th>
                <th className="text-center py-2 px-3">Quantity</th>
                <th className="text-center py-2 px-3">Unit Price</th>
                <th className="text-center py-2 px-3">Currency</th>
                <th className="text-center py-2 px-3">Total (PHP)</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-3">
                    <Input 
                      id={`item-description-${index}`}
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description" 
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input 
                      id={`item-quantity-${index}`}
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity || 0}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="Qty" 
                      className="w-full text-center"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input 
                      id={`item-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price || 0}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      placeholder="Price" 
                      className="w-full text-center"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <select 
                      id={`item-currency-${index}`}
                      value={item.currency}
                      onChange={(e) => handleItemChange(index, 'currency', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-center"
                    >
                      {CURRENCY_OPTIONS.map(currency => (
                        <option key={currency.value} value={currency.value}>{currency.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                        ₱
                      </div>
                      <Input 
                        id={`item-total-${index}`}
                        type="text"
                        value={item.total ? item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                        readOnly
                        className="bg-muted text-center w-full font-mono pl-8"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="text-destructive p-0 h-auto"
                        onClick={() => removeItem(index)}
                      >
                        ×
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {/* Subtotal row */}
              <tr className="border-t border-dashed">
                <td colSpan={4} className="py-2 px-3 text-right font-medium">
                  Subtotal:
                </td>
                <td className="py-2 px-3">
                  <div className="flex justify-center items-center">
                    <span className="text-muted-foreground font-mono mr-1">₱</span>
                    <span className="font-mono font-medium border-b-2 border-double">
                      {calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={addItem}>
          Add Another Item
        </Button>
      </div>
    </div>
  );
} 