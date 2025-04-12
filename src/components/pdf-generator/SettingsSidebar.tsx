import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Settings, HelpCircle } from "lucide-react";
import { CompanyInfoSection } from "./CompanyInfoSection";
import { PDFFormData } from "@/types/pdf-generator";
import { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsSidebarProps {
  formData: PDFFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  updateDefaultExchangeRate: (rate: number) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onCompanyKeyInput: (data: Partial<PDFFormData>) => void;
}

export function SettingsSidebar({
  formData,
  errors,
  handleInputChange,
  updateDefaultExchangeRate,
  isOpen,
  setIsOpen,
  onCompanyKeyInput: handleCompanyKeyInput,
}: SettingsSidebarProps) {
  const hasCompanyErrors = errors.companyName || errors.companyAddress || errors.companyPhone || errors.companyEmail;

  return (
    <div 
      className={`fixed top-0 right-0 h-full z-10 transition-all duration-300 ${
        isOpen ? 'w-96 sm:w-96 w-full' : 'w-12 sm:w-12 w-0'
      }`}
    >
      {isOpen ? (
        <div className="h-full bg-background border-l shadow-md flex flex-col">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Document Settings</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Company Information</CardTitle>
                  { hasCompanyErrors && <span className="text-red-500 text-sm">Company Key is required</span>}
                </CardHeader>
                <CardContent className="py-1">
                  <CompanyInfoSection 
                    formData={formData}
                    onCompanyKeyInput={handleCompanyKeyInput}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Document Details</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Document Type</label>
                      <select
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="quotation">Quotation</option>
                        <option value="invoice">Invoice</option>
                        <option value="statement_of_account">Statement of Account</option>
                      </select>
                      {errors.documentType && (
                        <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Document Number</label>
                      <input
                        type="text"
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded-md"
                      />
                      {errors.documentNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Document Date</label>
                      <input
                        type="date"
                        name="documentDate"
                        value={formData.documentDate}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded-md"
                      />
                      {errors.documentDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.documentDate}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Exchange Rate</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Default Exchange Rate (USD to PHP)</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This rate will be used to convert USD items to PHP.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          name="defaultExchangeRate"
                          value={formData.defaultExchangeRate}
                          onChange={handleInputChange}
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop collapsed sidebar strip */}
          <div 
            className="h-full hidden sm:flex bg-primary/10 hover:bg-primary/20 border-l border-primary/20 cursor-pointer items-center justify-center transition-colors duration-200 relative"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative">
              <Settings className="h-5 w-5 text-primary" />
              {formData.companyName === '' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
              )}
            </div>
          </div>

          {/* Mobile floating button */}
          <div className="fixed top-1/2 right-2 sm:hidden z-50 transform -translate-y-1/2">
            <Button
              variant="outline"
              className="rounded-full p-3 shadow-lg bg-primary text-white relative"
              onClick={() => setIsOpen(true)}
            >
              <Settings className="h-5 w-5" />
              {formData.companyName === '' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 