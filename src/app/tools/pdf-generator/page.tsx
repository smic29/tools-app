"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { usePDFForm } from "@/hooks/usePDFForm";
import { generatePDF } from "@/utils/pdfGenerator";
import { ClientInfoSection } from "@/components/pdf-generator/ClientInfoSection";
import { CargoDetailsSection } from "@/components/pdf-generator/CargoDetailsSection";
import { ItemsSection } from "@/components/pdf-generator/ItemsSection";
import { PreviewSection } from "@/components/pdf-generator/PreviewSection";
import { SettingsSidebar } from "@/components/pdf-generator/SettingsSidebar";

export default function PDFGenerator() {
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const {
    formData,
    errors,
    isGenerating,
    setIsGenerating,
    handleInputChange,
    handleItemChange,
    updateDefaultExchangeRate,
    addItem,
    removeItem,
    calculateTotal,
    clearForm,
    validateForm,
    getAmountInWords,
    handleCompanyKeyInput,
  } = usePDFForm();

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const handleGeneratePDF = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsGenerating(true);
    
    try {
      await generatePDF(formData);
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background print:w-full print:p-0">
      {/* Header */}
      <header className="border-b print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">PDF Generator</h1>
              <p className="text-muted-foreground mt-2">
                Create professional billing and quotation PDFs
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Tools
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 print:p-0 print:m-0 print:w-full transition-all duration-300 ${!showPreview && sidebarOpen ? 'pr-96' : !showPreview ? 'sm:pr-12' : ''}`}>
        {!showPreview ? (
          <Card className="w-full sm:max-w-4xl md:max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle>Document Form</CardTitle>
              <CardDescription>
                Fill in the details below to generate your PDF document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <Button type="button" variant="outline" onClick={clearForm}>
                    Clear Form
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={handlePreview}>
                      Preview
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleGeneratePDF}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate PDF"}
                    </Button>
                  </div>
                </div>
                {/* Client Information */}
                <ClientInfoSection 
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />

                {/* Cargo Details */}
                <CargoDetailsSection 
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />

                {/* Items */}
                <ItemsSection 
                  formData={formData}
                  errors={errors}
                  handleItemChange={handleItemChange}
                  addItem={addItem}
                  removeItem={removeItem}
                  calculateTotal={calculateTotal}
                />
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-6xl mx-auto print:w-full print:border-none print:shadow-none print:p-0">
            <CardHeader className="print:hidden">
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Review your document before generating the PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="print:w-full print:shadow-none print:p-0">
              <div ref={previewRef} className="print:w-full print:h-screen print:border-none print:shadow-none print:p-0">
                <PreviewSection 
                  formData={formData}
                  calculateTotal={calculateTotal}
                  getAmountInWords={getAmountInWords}
                  handleBack={handleBack}
                  handlePrint={handlePrint}
                  handleGeneratePDF={handleGeneratePDF}
                  isGenerating={isGenerating}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Settings Sidebar */}
      {!showPreview && (
        <SettingsSidebar 
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          updateDefaultExchangeRate={updateDefaultExchangeRate}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onCompanyKeyInput={handleCompanyKeyInput}
        />
      )}
    </div>
  );
} 