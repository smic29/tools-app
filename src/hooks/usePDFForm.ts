import { useState, useEffect } from 'react';
import { PDFFormData, Item } from '@/types/pdf-generator';
import { pesoToWords } from '@/utils/numberToWords';

// Default form data
const defaultFormData: PDFFormData = {
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
  defaultExchangeRate: 55.0,
  items: [
    { description: "", quantity: 0, price: 0, currency: "PHP", exchangeRate: 55.0, total: 0 }
  ],
  notes: ""
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

  const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      setFormData({
        ...defaultFormData,
        defaultExchangeRate: formData.defaultExchangeRate, // Keep the default exchange rate
        items: [
          { description: "", quantity: 0, price: 0, currency: "PHP", exchangeRate: formData.defaultExchangeRate, total: 0 }
        ]
      });
      localStorage.removeItem('pdfGeneratorData');
      
      // Generate a new document number after clearing
      setTimeout(() => {
        generateDocumentNumber();
      }, 100);
    }
  };

  const getAmountInWords = () => {
    return pesoToWords(calculateTotal());
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
    getAmountInWords
  };
} 