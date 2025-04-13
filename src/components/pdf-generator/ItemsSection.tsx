import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { PDFFormData, CURRENCY_OPTIONS } from "@/types/pdf-generator";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        Items
        <span className="text-sm text-muted-foreground ms-1">
          ($1 = ₱ {formData.defaultExchangeRate})
        </span>
      </h3>
      {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}

      {/* Desktop table */}
      {isDesktop ? (
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
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity || 0}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        className="text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        min="0"
                        value={item.price || 0}
                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        className="text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={item.currency}
                        onChange={(e) => handleItemChange(index, "currency", e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-center"
                      >
                        {CURRENCY_OPTIONS.map((currency) => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">
                      ₱ {item.total?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 text-center">
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
                  <td className="py-2 px-3 text-center font-mono font-medium">
                    ₱ {calculateTotal().toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
      ) : (
        // Mobile: cards + drawer
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="rounded-xl border p-4 flex flex-col gap-2">
              <div className="text-sm font-medium">{item.description || "Unnamed Item"}</div>
              <div className="text-xs text-muted-foreground flex flex-wrap justify-between">
                <div>Qty: {item.quantity || 0}</div>
                <div>Unit: {item.price || 0} {item.currency}</div>
                <div>Total: ₱ {item.total?.toFixed(2) || "0.00"}</div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setDrawerIndex(index)}>
                      Edit
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Edit Item</DrawerTitle>
                    </DrawerHeader>
                    {drawerIndex !== null && (
                      <div className="space-y-3 p-4">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(drawerIndex, "description", e.target.value)}
                        />
                        <div>
                          <label className="block text-xs font-medium mb-1">Quantity</label>
                          <Input
                            placeholder="Quantity"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(drawerIndex, "quantity", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Unit Price</label>
                          <Input
                            placeholder="Unit Price"
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(drawerIndex, "price", e.target.value)}
                          />
                        </div>
                        <select
                          value={item.currency}
                          onChange={(e) => handleItemChange(drawerIndex, "currency", e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          {CURRENCY_OPTIONS.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <DrawerFooter>
                      <DrawerTrigger asChild>
                        <Button variant="default">Done</Button>
                      </DrawerTrigger>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                {index > 0 && (
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="text-right text-sm font-medium">
            Subtotal: ₱ {calculateTotal().toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={addItem}>
            Add Another Item
          </Button>
        </div>
      )}
    </div>
  );
}
