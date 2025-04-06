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
  // Company Information
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string;
  companyisNonVat: boolean;
  companyTin: string;
  companyAuthRep: string;

  // Document Details
  documentType: "quotation" | "invoice" | "statement_of_account";
  documentNumber: string;
  documentDate: string;
  dueDate?: string;

  // Client Information
  clientName: string;
  clientAddress: string;

  // Cargo Details
  portOfDischarge: string;
  portOfLoading: string;
  vesselVoyage: string;
  billOfLadingNo: string;
  eta: string;
  jobDescription: string;

  // Items
  items: {
    description: string;
    quantity: number;
    price: number;
    currency: "USD" | "PHP";
    total: number;
  }[];

  // Exchange Rate
  defaultExchangeRate: number;
}

// Define the document type options
export const DOCUMENT_TYPES = [
  { value: "quotation", label: "Quotation" },
  { value: "invoice", label: "Invoice" },
  { value: "statement_of_account", label: "Statement of Account" }
] as const;

// Define the currency options
export const CURRENCY_OPTIONS = [
  { value: "PHP", label: "PHP" },
  { value: "USD", label: "USD" }
] as const; 