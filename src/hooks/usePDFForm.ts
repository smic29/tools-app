import { useState, useEffect } from 'react';
import { PDFFormData } from '@/types/pdf-generator';
import { currencyToWords } from '@/utils/numberToWords';

// Define a type for the item structure
interface ItemData {
  description: string;
  quantity: number;
  price: number;
  currency: "USD" | "PHP";
  total: number;
}

// Default form data
const defaultFormData: PDFFormData = {
  companyName: "",
  companyAddress: "",
  companyPhone: "",
  companyEmail: "",
  companyLogo: "",
  companyisNonVat: false,
  companyTin: "",
  companyAuthRep: "",
  documentType: "quotation",
  documentNumber: "",
  documentDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  clientName: "",
  clientAddress: "",
  portOfDischarge: "",
  portOfLoading: "",
  vesselVoyage: "",
  billOfLadingNo: "",
  eta: "",
  jobDescription: "",
  items: [
    {
      description: "",
      quantity: 1,
      price: 0,
      currency: "PHP",
      total: 0
    }
  ],
  defaultExchangeRate: 55.0
};

export function usePDFForm() {
  const [formData, setFormData] = useState<PDFFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

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
          companyLogo: parsedData.companyLogo || "",
          companyisNonVat: parsedData.companyisNonVat || false,
          companyAuthRep: parsedData.companyAuthRep || "",
          companyTin: parsedData.companyTin || "",
          clientName: parsedData.clientName || "",
          clientAddress: parsedData.clientAddress || "",
          documentType: parsedData.documentType || "quotation",
          documentNumber: parsedData.documentNumber || "",
          documentDate: parsedData.documentDate || "",
          defaultExchangeRate: defaultRate, // Use the loaded exchange rate
          items: Array.isArray(parsedData.items) && parsedData.items.length > 0 
            ? parsedData.items.map((item: ItemData) => ({
                description: item.description || "",
                quantity: typeof item.quantity === 'number' ? item.quantity : 0,
                price: typeof item.price === 'number' ? item.price : 0,
                currency: item.currency || "PHP",
                total: 0 // We'll calculate this below
              }))
            : [{ description: "", quantity: 1, price: 0, currency: "PHP", total: 0 }],
          portOfDischarge: parsedData.portOfDischarge || "",
          portOfLoading: parsedData.portOfLoading || "",
          vesselVoyage: parsedData.vesselVoyage || "",
          billOfLadingNo: parsedData.billOfLadingNo || "",
          eta: parsedData.eta || "",
          jobDescription: parsedData.jobDescription || ""
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
          total = Number((item.quantity * item.price * formData.defaultExchangeRate).toFixed(2));
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
      case 'invoice':
        prefix = 'I';
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

  const handleCompanyKeyInput = (data: Partial<PDFFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    
    // Ensure the item exists
    if (!newItems[index]) {
      newItems[index] = { 
        description: "", 
        quantity: 0, 
        price: 0, 
        currency: "PHP", 
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
    
    // Calculate total based on currency
    let total = 0;
    if (newItems[index].currency === 'USD') {
      total = Number((newItems[index].quantity * newItems[index].price * formData.defaultExchangeRate).toFixed(2));
    } else {
      total = Number((newItems[index].quantity * newItems[index].price).toFixed(2));
    }
    
    newItems[index].total = total;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
    
    // Clear item errors when edited
    if (errors.items) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.items;
        return newErrors;
      });
    }
  };

  const updateDefaultExchangeRate = (rate: number) => {
    // Update the default exchange rate
    setFormData(prev => ({
      ...prev,
      defaultExchangeRate: rate
    }));
    
    // Save to localStorage for future sessions
    localStorage.setItem('defaultExchangeRate', rate.toString());
    
    // Recalculate totals for all USD items
    const updatedItems = formData.items.map(item => {
      if (item.currency === 'USD') {
        const total = Number((item.quantity * item.price * rate).toFixed(2));
        return { ...item, total };
      }
      return item;
    });
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, price: 0, currency: "PHP", total: 0 }
      ]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const clearForm = () => {
    setFormData(defaultFormData);
    setErrors({});
  };

  const getAmountInWords = () => {
    return currencyToWords(calculateTotal());
  };

  return {
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
  };
} 