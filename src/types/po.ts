export interface POItemData {
  id?: string;
  itemNumber: string;
  description: string;
  qty: number | string;
  unitPrice: number | string;
  total: number;
}

export interface PurchaseOrderData {
  id?: string;
  poNumber: string;
  date: string;
  
  // Company Details
  companyLogo?: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;

  // Vendor Details
  vendorName: string;
  vendorTin: string;
  vendorAddress: string;
  vendorDept: string;
  vendorEmail: string;

  // Ship To Details
  shipToCompany: string;
  shipToAddress: string;
  shipToPhone: string;

  // Shipping Info
  requisitioner: string;
  shipVia: string;
  fob: string;
  shippingTerms: string;

  // Items
  items: POItemData[];

  // Financials
  subtotal: number;
  tax: number | string;
  shipping: number | string;
  other: number | string;
  total: number;
  currency: string;

  comments: string;
  contactInfo: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
}

export const INITIAL_PO_DATA: PurchaseOrderData = {
  poNumber: "0002",
  date: "9/16/2026",
  companyLogo: "", // Default company logo
  companyName: "Mobile Miracles (pvt) Ltd",
  companyAddress: "No 140, Darmapala Mawatha, Mirihella, Kegalle",
  companyPhone: "0743251110",

  vendorName: "POOVA HOLDINGS (PVT) LTD",
  vendorTin: "103305721",
  vendorAddress: "NO 129/1/A, Highlevel Road, Kirulapona",
  vendorDept: "Sales Department",
  vendorEmail: "sales@poovaholdings.com",

  shipToCompany: "Mobile Miracles (pvt) Ltd",
  shipToAddress: "No 140, Darmapala Mawatha, Mirihella, Kegalle",
  shipToPhone: "0743251110",

  requisitioner: "",
  shipVia: "",
  fob: "",
  shippingTerms: "",

  items: [
    {
      id: "1",
      itemNumber: "Ulefone Note 23",
      description: "(3GB + 32GB)",
      qty: 30,
      unitPrice: 27081.00,
      total: 812430.00,
    }
  ],

  subtotal: 812430.00,
  tax: 0,
  shipping: 0,
  other: 0,
  total: 812430.00,
  currency: "LKR", // Changed default currency to LKR

  comments: "",
  contactInfo: "[Name, Phone #, E-mail]",
  status: "ISSUED"
};
