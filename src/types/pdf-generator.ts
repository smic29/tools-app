// Define the item interface
export interface Item {
  description: string;
  quantity: number;
  price: number;
  currency: string;
  exchangeRate: number;
  total: number;
}

// Define the form data interface
export interface PDFFormData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  clientName: string;
  clientAddress: string;
  documentType: "quotation" | "billing_statement" | "statement_of_account";
  documentNumber: string;
  documentDate: string;
  dueDate: string;
  defaultExchangeRate: number;
  items: Item[];
  notes: string;
}

// Define the document type options
export const DOCUMENT_TYPES = [
  { value: "quotation", label: "Quotation" },
  { value: "billing_statement", label: "Billing Statement" },
  { value: "statement_of_account", label: "Statement of Account" }
] as const;

// Define the currency options
export const CURRENCY_OPTIONS = [
  { value: "PHP", label: "PHP" },
  { value: "USD", label: "USD" }
] as const; 