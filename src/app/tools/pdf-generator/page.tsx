"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { pesoToWords } from "@/utils/numberToWords";

// Define the item interface to fix the 'any' type error
interface Item {
  description: string;
  quantity: number;
  price: number;
  currency: string;
  exchangeRate: number;
  total: number;
}

export default function PDFGenerator() {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    clientName: "",
    clientAddress: "",
    documentType: "quotation",
    documentNumber: "",
    documentDate: "",
    dueDate: "",
    defaultExchangeRate: 55.0, // Default exchange rate for USD to PHP
    items: [
      { description: "", quantity: 0, price: 0, currency: "PHP", exchangeRate: 55.0, total: 0 }
    ],
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    // First, try to load the saved exchange rate
    const savedExchangeRate = localStorage.getItem('defaultExchangeRate');
    let defaultRate = 55.0; // Default value
    
    if (savedExchangeRate) {
      const rate = parseFloat(savedExchangeRate);
      if (!isNaN(rate)) {
        defaultRate = rate;
      }
    }
    
    // Then load the saved form data
    const savedData = localStorage.getItem('pdfGeneratorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure all required fields exist and have proper types
        setFormData({
          companyName: parsedData.companyName || "",
          companyAddress: parsedData.companyAddress || "",
          companyPhone: parsedData.companyPhone || "",
          companyEmail: parsedData.companyEmail || "",
          clientName: parsedData.clientName || "",
          clientAddress: parsedData.clientAddress || "",
          documentType: parsedData.documentType || "quotation",
          documentNumber: parsedData.documentNumber || "",
          documentDate: parsedData.documentDate || "",
          dueDate: parsedData.dueDate || "",
          defaultExchangeRate: defaultRate, // Use the loaded exchange rate
          items: Array.isArray(parsedData.items) && parsedData.items.length > 0 
            ? parsedData.items.map((item: Item) => ({
                description: item.description || "",
                quantity: typeof item.quantity === 'number' ? item.quantity : 0,
                price: typeof item.price === 'number' ? item.price : 0,
                currency: item.currency || "PHP",
                exchangeRate: item.currency === 'USD' ? defaultRate : (typeof item.exchangeRate === 'number' ? item.exchangeRate : defaultRate),
                total: 0 // We'll calculate this below
              }))
            : [{ description: "", quantity: 0, price: 0, currency: "PHP", exchangeRate: defaultRate, total: 0 }],
          notes: parsedData.notes || ""
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    
    // Generate initial document number
    generateDocumentNumber();
  }, []);

  // Calculate totals for all items after form data is loaded
  useEffect(() => {
    // This effect will run after formData is set
    if (formData.items.length > 0) {
      const updatedItems = formData.items.map(item => {
        // Calculate total based on currency with proper rounding
        let total = 0;
        if (item.currency === 'USD') {
          total = Number((item.quantity * item.price * item.exchangeRate).toFixed(2));
        } else {
          total = Number((item.quantity * item.price).toFixed(2));
        }
        
        return {
          ...item,
          total
        };
      });
      
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  }, [formData.defaultExchangeRate]);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('pdfGeneratorData', JSON.stringify(formData));
  }, [formData]);

  // Generate document number when document type or date changes
  useEffect(() => {
    if (formData.documentDate) {
      generateDocumentNumber();
    }
  }, [formData.documentType, formData.documentDate]);

  const generateDocumentNumber = () => {
    // Get the current date in YYYY-MM-DD format
    const today = formData.documentDate || new Date().toISOString().split('T')[0];
    
    // Get the last used number from localStorage or start with 1
    const lastNumberKey = `lastNumber_${formData.documentType}_${today}`;
    let lastNumber = parseInt(localStorage.getItem(lastNumberKey) || '0');
    lastNumber += 1;
    
    // Save the new number
    localStorage.setItem(lastNumberKey, lastNumber.toString());
    
    // Format the document number based on document type
    let prefix = '';
    switch (formData.documentType) {
      case 'quotation':
        prefix = 'Q';
        break;
      case 'billing_statement':
        prefix = 'B';
        break;
      case 'statement_of_account':
        prefix = 'S';
        break;
      default:
        prefix = 'D';
    }
    
    // Format: PREFIX-YYYYMMDD-XXXX (where XXXX is the sequential number)
    const formattedDate = today.replace(/-/g, '');
    const paddedNumber = lastNumber.toString().padStart(4, '0');
    const newDocumentNumber = `${prefix}-${formattedDate}-${paddedNumber}`;
    
    // Update the form data with the new document number
    setFormData(prev => ({
      ...prev,
      documentNumber: newDocumentNumber
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.companyAddress) newErrors.companyAddress = "Company address is required";
    if (!formData.clientName) newErrors.clientName = "Client name is required";
    if (!formData.documentNumber) newErrors.documentNumber = "Document number is required";
    if (!formData.documentDate) newErrors.documentDate = "Document date is required";
    if (formData.documentType === "billing_statement" && !formData.dueDate) {
      newErrors.dueDate = "Due date is required for billing statements";
    }
    
    // Validate items
    const hasEmptyItems = formData.items.some(
      item => !item.description || item.quantity <= 0 || item.price <= 0
    );
    if (hasEmptyItems) {
      newErrors.items = "All items must have description, quantity, and price";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    
    // Ensure the item exists
    if (!newItems[index]) {
      newItems[index] = { 
        description: "", 
        quantity: 0, 
        price: 0, 
        currency: "PHP", 
        exchangeRate: formData.defaultExchangeRate, 
        total: 0 
      };
    }
    
    // Handle empty string values for numeric fields
    if (field === 'quantity' || field === 'price') {
      if (value === '') {
        value = 0;
      } else if (typeof value === 'string') {
        value = Number(value);
        if (isNaN(value)) {
          value = 0;
        }
      }
    }
    
    // Update the item
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // If currency is changed to USD, set the exchange rate to the default
    if (field === 'currency' && value === 'USD') {
      newItems[index].exchangeRate = formData.defaultExchangeRate;
    }
    
    // Calculate total if quantity, price, currency, or exchange rate changes
    if (field === 'quantity' || field === 'price' || field === 'currency' || field === 'exchangeRate') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const price = field === 'price' ? Number(value) : newItems[index].price;
      const exchangeRate = field === 'exchangeRate' ? Number(value) : newItems[index].exchangeRate;
      
      // Calculate total in PHP with proper rounding for financial calculations
      if (newItems[index].currency === 'USD') {
        // For USD, multiply by exchange rate and round to 2 decimal places
        newItems[index].total = Number((quantity * price * exchangeRate).toFixed(2));
      } else {
        // For PHP, just multiply and round to 2 decimal places
        newItems[index].total = Number((quantity * price).toFixed(2));
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
    
    // Clear items error when an item is edited
    if (errors.items) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.items;
        return newErrors;
      });
    }
  };

  const updateDefaultExchangeRate = (rate: number) => {
    if (isNaN(rate)) return; // Prevent NaN values
    
    // Round exchange rate to 2 decimal places
    const roundedRate = Number(rate.toFixed(2));
    
    setFormData(prev => {
      // Update the default exchange rate
      const updatedData = {
        ...prev,
        defaultExchangeRate: roundedRate
      };
      
      // Update all USD items with the new exchange rate
      const updatedItems = prev.items.map(item => {
        if (item.currency === 'USD') {
          return {
            ...item,
            exchangeRate: roundedRate,
            total: Number((item.quantity * item.price * roundedRate).toFixed(2))
          };
        }
        return item;
      });
      
      updatedData.items = updatedItems;
      return updatedData;
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        description: "", 
        quantity: 0, 
        price: 0, 
        currency: "PHP", 
        exchangeRate: prev.defaultExchangeRate, 
        total: 0 
      }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    // Sum all item totals and round to 2 decimal places
    return Number(formData.items.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2));
  };

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

  const generatePDF = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create PDF directly with jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set font
      pdf.setFont('helvetica');
      
      // Add company information
      pdf.setFontSize(16);
      pdf.text(formData.companyName, 20, 20);
      
      pdf.setFontSize(10);
      pdf.text(formData.companyAddress, 20, 27);
      pdf.text(`Phone: ${formData.companyPhone}`, 20, 32);
      pdf.text(`Email: ${formData.companyEmail}`, 20, 37);
      pdf.text('NON-VAT Registration', 20, 42);
      
      // Add document type and details
      pdf.setFontSize(14);
      let documentTitle = "QUOTATION";
      if (formData.documentType === "billing_statement") {
        documentTitle = "BILLING STATEMENT";
      } else if (formData.documentType === "statement_of_account") {
        documentTitle = "STATEMENT OF ACCOUNT";
      }
      pdf.text(documentTitle, 150, 20, { align: 'right' });
      
      pdf.setFontSize(10);
      pdf.text(`No: ${formData.documentNumber}`, 150, 27, { align: 'right' });
      pdf.text(`Date: ${formData.documentDate}`, 150, 32, { align: 'right' });
      if (formData.documentType === "billing_statement" && formData.dueDate) {
        pdf.text(`Due Date: ${formData.dueDate}`, 150, 37, { align: 'right' });
      }
      
      // Add client information
      pdf.setFontSize(12);
      pdf.text('Bill To:', 20, 55);
      
      pdf.setFontSize(10);
      pdf.text(formData.clientName, 20, 62);
      pdf.text(formData.clientAddress, 20, 67);
      
      // Add items table
      pdf.setFontSize(12);
      pdf.text('Items', 20, 85);
      
      // Table headers
      pdf.setFontSize(10);
      pdf.text('Description', 20, 92);
      pdf.text('Quantity', 80, 92);
      pdf.text('Unit Price', 100, 92);
      pdf.text('Currency', 120, 92);
      pdf.text('Total (PHP)', 150, 92);
      
      // Table rows
      let yPos = 99;
      formData.items.forEach(item => {
        pdf.text(item.description, 20, yPos);
        pdf.text(item.quantity.toString(), 80, yPos);
        pdf.text(item.price.toFixed(2), 100, yPos);
        pdf.text(item.currency, 120, yPos);
        pdf.text(item.total.toFixed(2), 150, yPos);
        yPos += 7;
      });
      
      // Total
      pdf.setFontSize(10);
      pdf.text('Total (PHP):', 120, yPos + 5);
      pdf.setFont('courier'); // Use monospace font for better alignment
      pdf.text(`₱ ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 150, yPos + 5);
      pdf.setFont('helvetica'); // Reset to default font
      
      // Amount in words
      pdf.setFontSize(9);
      pdf.text('Amount in words:', 20, yPos + 12);
      pdf.setFontSize(8);
      const amountInWords = pesoToWords(calculateTotal());
      const wordsLines = pdf.splitTextToSize(amountInWords, 170);
      pdf.text(wordsLines, 20, yPos + 18);
      
      // Notes
      if (formData.notes) {
        pdf.setFontSize(12);
        pdf.text('Notes:', 20, yPos + 12 + (wordsLines.length * 5));
        
        pdf.setFontSize(10);
        const notesLines = pdf.splitTextToSize(formData.notes, 170);
        pdf.text(notesLines, 20, yPos + 18 + (wordsLines.length * 5));
      }
      
      // Footer
      pdf.setFontSize(10);
      pdf.text('Thank you for your business!', 105, 270, { align: 'center' });
      
      // Save the PDF
      const fileName = `${formData.documentType}-${formData.documentNumber || 'document'}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      setFormData({
        companyName: "",
        companyAddress: "",
        companyPhone: "",
        companyEmail: "",
        clientName: "",
        clientAddress: "",
        documentType: "quotation",
        documentNumber: "",
        documentDate: "",
        dueDate: "",
        defaultExchangeRate: formData.defaultExchangeRate, // Keep the default exchange rate
        items: [
          { description: "", quantity: 0, price: 0, currency: "PHP", exchangeRate: formData.defaultExchangeRate, total: 0 }
        ],
        notes: ""
      });
      localStorage.removeItem('pdfGeneratorData');
      toast.success("Form data cleared");
      
      // Generate a new document number after clearing
      setTimeout(() => {
        generateDocumentNumber();
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
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
      <main className="container mx-auto px-4 py-8">
        {!showPreview ? (
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle>Billing/Quotation Form</CardTitle>
              <CardDescription>
                Fill in the details below to generate your PDF document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Company Information */}
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

                {/* Client Information */}
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

                {/* Document Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Document Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Document Type</Label>
                      <select 
                        id="documentType" 
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="quotation">Quotation</option>
                        <option value="billing_statement">Billing Statement</option>
                        <option value="statement_of_account">Statement of Account</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">Document Number *</Label>
                      <Input 
                        id="documentNumber" 
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleInputChange}
                        placeholder="Auto-generated" 
                        className={errors.documentNumber ? "border-red-500" : ""}
                        readOnly
                      />
                      {errors.documentNumber && (
                        <p className="text-sm text-red-500">{errors.documentNumber}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Document number is auto-generated</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentDate">Date *</Label>
                      <Input 
                        id="documentDate" 
                        name="documentDate"
                        type="date"
                        value={formData.documentDate}
                        onChange={handleInputChange}
                        className={errors.documentDate ? "border-red-500" : ""}
                      />
                      {errors.documentDate && (
                        <p className="text-sm text-red-500">{errors.documentDate}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">
                        Due Date {formData.documentType === "billing_statement" && "*"}
                      </Label>
                      <Input 
                        id="dueDate" 
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className={errors.dueDate ? "border-red-500" : ""}
                      />
                      {errors.dueDate && (
                        <p className="text-sm text-red-500">{errors.dueDate}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Exchange Rate */}
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

                {/* Items */}
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
                                  <option value="PHP">PHP</option>
                                  <option value="USD">USD</option>
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

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes" 
                    rows={4} 
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={clearForm}>
                    Clear Form
                  </Button>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handlePreview}>
                      Preview
                    </Button>
                    <Button 
                      type="button" 
                      onClick={generatePDF}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate PDF"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Review your document before generating the PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={previewRef} className="border p-6 space-y-6 print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{formData.companyName}</h2>
                    <p className="text-sm">{formData.companyAddress}</p>
                    <p className="text-sm">Phone: {formData.companyPhone}</p>
                    <p className="text-sm">Email: {formData.companyEmail}</p>
                    <p className="text-sm mt-2">NON-VAT Registration</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-xl font-bold uppercase">
                      {formData.documentType === 'quotation' ? 'QUOTATION' : 
                       formData.documentType === 'billing_statement' ? 'BILLING STATEMENT' : 
                       'STATEMENT OF ACCOUNT'}
                    </h1>
                    <p className="text-sm">No: {formData.documentNumber}</p>
                    <p className="text-sm">Date: {formData.documentDate}</p>
                    {formData.documentType === "billing_statement" && formData.dueDate && (
                      <p className="text-sm">Due Date: {formData.dueDate}</p>
                    )}
                  </div>
                </div>

                {/* Client Info */}
                <div className="mt-6">
                  <h3 className="font-medium">Bill To:</h3>
                  <p>{formData.clientName}</p>
                  <p>{formData.clientAddress}</p>
                </div>

                {/* Items Table */}
                <div className="mt-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-center py-2">Quantity</th>
                        <th className="text-center py-2">Unit Price</th>
                        <th className="text-center py-2">Currency</th>
                        <th className="text-center py-2">Total (PHP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-center">{item.price.toFixed(2)}</td>
                          <td className="text-center">{item.currency}</td>
                          <td className="text-center font-mono">
                            <div className="flex justify-center">
                              <span className="text-muted-foreground mr-1">₱</span>
                              <span>{item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td colSpan={4} className="py-2">
                          <div className="text-sm uppercase">
                            {pesoToWords(calculateTotal())}
                          </div>
                        </td>
                        <td className="text-center py-2 font-mono">
                          <div className="flex justify-center">
                            <span className="text-muted-foreground mr-1">₱</span>
                            <span>{calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Notes */}
                {formData.notes && (
                  <div className="mt-6">
                    <h3 className="font-medium">Notes:</h3>
                    <p className="whitespace-pre-line">{formData.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-sm">
                  <p>Thank you for your business!</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6 print:hidden">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Form
                </Button>
                <Button type="button" onClick={handlePrint}>
                  Print
                </Button>
                <Button 
                  type="button" 
                  onClick={generatePDF}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate PDF"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Tools App | Created by{" "}
            <a 
              href="https://github.com/smic29" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Spicy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
} 