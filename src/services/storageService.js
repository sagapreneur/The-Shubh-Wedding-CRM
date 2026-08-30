import { INVOICE_STATUSES } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'tsw_crm_clients_v1',
  INVOICES: 'tsw_crm_invoices_v1',
  SETTINGS: 'tsw_crm_settings_v1'
};

const DEFAULT_SETTINGS = {
  studioName: 'The Shubh Wedding',
  tagline: 'Luxury Wedding & Portrait Photography',
  logoUrl: '/Logo-01.png',
  address: 'Studio 402, Heritage Craft Tower, Defence Colony, New Delhi 110024',
  phone: '+91 98100 87654',
  email: 'inquiries@theshubhwedding.com',
  gstin: '07AAAAA0000A1Z5',
  defaultTerms: '1. 50% advance required upon confirmation of booking.\n2. Balance 50% payable on or before final deliverable delivery.\n3. High-resolution raw and edited photos delivered via digital cloud gallery.',
  defaultTaxPercent: 18,
  taxEnabledByDefault: false,
  reminderTemplate: 'Hi {Client Name}, this is a gentle reminder that {Balance Due} is pending for Invoice #{Invoice No.} ({Service}) with The Shubh Wedding. Kindly complete the payment at your convenience. Thank you! 🙏',
  invoiceShareTemplate: 'Hi {Client Name}, please find attached your Invoice #{Invoice No.} for {Service} with The Shubh Wedding. Thank you for choosing us! 🙏'
};

const SEED_CLIENTS = [
  {
    id: 'cli_01',
    name: 'Rahul & Ananya Sharma',
    service: 'Full Wedding Photography & Cinematography',
    amount: 250000,
    address: 'B-14 Gulmohar Park, New Delhi 110049',
    whatsappNumber: '+919871122334',
    email: 'rahul.sharma@example.com',
    notes: 'Wedding at ITC Grand Bharat. Requires 4 team members + Drone operator.',
    createdAt: '2026-06-10T10:00:00Z'
  },
  {
    id: 'cli_02',
    name: 'Vikram & Pooja Malhotra',
    service: 'Pre-Wedding Concept Shoot',
    amount: 65000,
    address: '45 Vasant Vihar, Block C, New Delhi 110057',
    whatsappNumber: '+919818877665',
    email: 'pooja.m@example.com',
    notes: 'Shoot location: Neemrana Fort Palace.',
    createdAt: '2026-07-02T14:30:00Z'
  },
  {
    id: 'cli_03',
    name: 'Karan & Simran Kapur',
    service: 'Destination Wedding (Udaipur)',
    amount: 400000,
    address: 'Villa 12, Golf Links, New Delhi 110003',
    whatsappNumber: '+919999001122',
    email: 'karan.kapur@example.com',
    notes: '3-day coverage at The Leela Palace Udaipur.',
    createdAt: '2026-07-15T09:15:00Z'
  },
  {
    id: 'cli_04',
    name: 'Aditya & Riya Sen',
    service: 'Engagement & Sangeet Night',
    amount: 120000,
    address: '78 Greater Kailash 1, New Delhi 110048',
    whatsappNumber: '+919811234567',
    email: 'riya.sen@example.com',
    notes: 'Focus on candid expressions & family portraits.',
    createdAt: '2026-08-01T11:20:00Z'
  },
  {
    id: 'cli_05',
    name: 'Siddharth & Meera Roy',
    service: 'Reception & Traditional Ceremony',
    amount: 180000,
    address: 'Flat 304, Green Park Main, New Delhi 110016',
    whatsappNumber: '+919717654321',
    email: 'sid.roy@example.com',
    notes: 'Deliverable includes 2 Handmade Leather Albums.',
    createdAt: '2026-08-12T16:00:00Z'
  }
];

const SEED_INVOICES = [
  {
    id: 'inv_01',
    invoiceNumber: 'TSW-2026-001',
    clientId: 'cli_01',
    clientName: 'Rahul & Ananya Sharma',
    clientService: 'Full Wedding Photography & Cinematography',
    clientAddress: 'B-14 Gulmohar Park, New Delhi 110049',
    clientWhatsapp: '+919871122334',
    clientEmail: 'rahul.sharma@example.com',
    invoiceDate: '2026-06-12',
    dueDate: '2026-06-25',
    status: INVOICE_STATUSES.PAID,
    items: [
      { id: 'itm_101', description: 'Main Wedding Day Candid Photography & Traditional Stills', quantity: 1, rate: 130000, amount: 130000, sortOrder: 0 },
      { id: 'itm_102', description: '4K Cinematic Wedding Film & Teaser Video', quantity: 1, rate: 90000, amount: 90000, sortOrder: 1 },
      { id: 'itm_103', description: 'Drone Aerial Coverage & Live Screen Feed', quantity: 1, rate: 30000, amount: 30000, sortOrder: 2 }
    ],
    subtotal: 250000,
    discountType: 'flat',
    discountValue: 0,
    discount: 0,
    enableTax: false,
    taxPercent: 18,
    taxAmount: 0,
    grandTotal: 250000,
    amountPaid: 250000,
    balanceDue: 0,
    paymentMode: 'Bank Transfer',
    paymentNote: 'Full payment received via NEFT Ref #994821',
    notes: '50% advance on booking, 50% on completion.',
    lastEditedAt: '2026-06-26T10:00:00Z',
    createdAt: '2026-06-12T10:00:00Z'
  },
  {
    id: 'inv_02',
    invoiceNumber: 'TSW-2026-002',
    clientId: 'cli_02',
    clientName: 'Vikram & Pooja Malhotra',
    clientService: 'Pre-Wedding Concept Shoot',
    clientAddress: '45 Vasant Vihar, Block C, New Delhi 110057',
    clientWhatsapp: '+919818877665',
    clientEmail: 'pooja.m@example.com',
    invoiceDate: '2026-07-05',
    dueDate: '2026-07-20',
    status: INVOICE_STATUSES.PAID,
    items: [
      { id: 'itm_201', description: 'Outdoor Concept Shoot (Full Day at Neemrana)', quantity: 1, rate: 50000, amount: 50000, sortOrder: 0 },
      { id: 'itm_202', description: 'Stylized Reel & Pre-Wedding Film Track', quantity: 1, rate: 15000, amount: 15000, sortOrder: 1 }
    ],
    subtotal: 65000,
    discountType: 'flat',
    discountValue: 0,
    discount: 0,
    enableTax: false,
    taxPercent: 18,
    taxAmount: 0,
    grandTotal: 65000,
    amountPaid: 65000,
    balanceDue: 0,
    paymentMode: 'UPI',
    paymentNote: 'Paid via GPay',
    notes: 'All edited stills delivered.',
    lastEditedAt: '2026-07-21T11:00:00Z',
    createdAt: '2026-07-05T14:30:00Z'
  },
  {
    id: 'inv_03',
    invoiceNumber: 'TSW-2026-003',
    clientId: 'cli_03',
    clientName: 'Karan & Simran Kapur',
    clientService: 'Destination Wedding (Udaipur)',
    clientAddress: 'Villa 12, Golf Links, New Delhi 110003',
    clientWhatsapp: '+919999001122',
    clientEmail: 'karan.kapur@example.com',
    invoiceDate: '2026-07-18',
    dueDate: '2026-08-01',
    status: INVOICE_STATUSES.PARTIALLY_PAID,
    items: [
      { id: 'itm_301', description: '3-Day Destination Photography & Cinematography Package', quantity: 1, rate: 320000, amount: 320000, sortOrder: 0 },
      { id: 'itm_302', description: 'Luxury Custom Photobooks (2 Sets)', quantity: 2, rate: 25000, amount: 50000, sortOrder: 1 },
      { id: 'itm_303', description: 'Crew Travel & Equipment Logistics', quantity: 1, rate: 30000, amount: 30000, sortOrder: 2 }
    ],
    subtotal: 400000,
    discountType: 'flat',
    discountValue: 0,
    discount: 0,
    enableTax: false,
    taxPercent: 18,
    taxAmount: 0,
    grandTotal: 400000,
    amountPaid: 200000,
    balanceDue: 200000,
    paymentMode: 'Bank Transfer',
    paymentNote: '50% advance token received via IMPS',
    notes: 'Balance 200,000 due before deliverables delivery.',
    lastEditedAt: '2026-07-20T16:00:00Z',
    createdAt: '2026-07-18T09:15:00Z'
  },
  {
    id: 'inv_04',
    invoiceNumber: 'TSW-2026-004',
    clientId: 'cli_04',
    clientName: 'Aditya & Riya Sen',
    clientService: 'Engagement & Sangeet Night',
    clientAddress: '78 Greater Kailash 1, New Delhi 110048',
    clientWhatsapp: '+919811234567',
    clientEmail: 'riya.sen@example.com',
    invoiceDate: '2026-08-02',
    dueDate: '2026-08-15',
    status: INVOICE_STATUSES.OVERDUE,
    items: [
      { id: 'itm_401', description: 'Engagement & Sangeet Evening Coverage', quantity: 1, rate: 90000, amount: 90000, sortOrder: 0 },
      { id: 'itm_402', description: 'Teaser Reel & Raw Video Handover', quantity: 1, rate: 30000, amount: 30000, sortOrder: 1 }
    ],
    subtotal: 120000,
    discountType: 'flat',
    discountValue: 0,
    discount: 0,
    enableTax: false,
    taxPercent: 18,
    taxAmount: 0,
    grandTotal: 120000,
    amountPaid: 40000,
    balanceDue: 80000,
    paymentMode: 'UPI',
    paymentNote: 'Initial advance paid via UPI',
    notes: 'Payment reminder sent via WhatsApp.',
    lastEditedAt: '2026-08-16T10:00:00Z',
    createdAt: '2026-08-02T11:20:00Z'
  },
  {
    id: 'inv_05',
    invoiceNumber: 'TSW-2026-005',
    clientId: 'cli_05',
    clientName: 'Siddharth & Meera Roy',
    clientService: 'Reception & Traditional Ceremony',
    clientAddress: 'Flat 304, Green Park Main, New Delhi 110016',
    clientWhatsapp: '+919717654321',
    clientEmail: 'sid.roy@example.com',
    invoiceDate: '2026-08-15',
    dueDate: '2026-08-31',
    status: INVOICE_STATUSES.SENT,
    items: [
      { id: 'itm_501', description: 'Reception Evening Photography & Traditional Video', quantity: 1, rate: 140000, amount: 140000, sortOrder: 0 },
      { id: 'itm_502', description: 'Handcrafted Premium Leather Albums (2 Sets)', quantity: 2, rate: 20000, amount: 40000, sortOrder: 1 }
    ],
    subtotal: 180000,
    discountType: 'flat',
    discountValue: 0,
    discount: 0,
    enableTax: false,
    taxPercent: 18,
    taxAmount: 0,
    grandTotal: 180000,
    amountPaid: 0,
    balanceDue: 180000,
    paymentMode: '',
    paymentNote: '',
    notes: 'Invoice sent to client over WhatsApp.',
    lastEditedAt: '2026-08-15T16:00:00Z',
    createdAt: '2026-08-15T16:00:00Z'
  }
];

export const storageService = {
  // Clients CRUD
  getClients: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SEED_CLIENTS));
      return SEED_CLIENTS;
    }
    return JSON.parse(data);
  },

  saveClients: (clients) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  addClient: (clientData) => {
    const clients = storageService.getClients();
    const newClient = {
      ...clientData,
      id: `cli_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    clients.unshift(newClient);
    storageService.saveClients(clients);
    return newClient;
  },

  updateClient: (updatedClient) => {
    const clients = storageService.getClients();
    const index = clients.findIndex(c => c.id === updatedClient.id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updatedClient };
      storageService.saveClients(clients);
      
      // Also update client details in all their existing invoices
      const invoices = storageService.getInvoices();
      let updatedInvoices = false;
      const newInvoices = invoices.map(inv => {
        if (inv.clientId === updatedClient.id) {
          updatedInvoices = true;
          return {
            ...inv,
            clientName: updatedClient.name,
            clientService: updatedClient.service,
            clientAddress: updatedClient.address,
            clientWhatsapp: updatedClient.whatsappNumber,
            clientEmail: updatedClient.email
          };
        }
        return inv;
      });
      if (updatedInvoices) {
        storageService.saveInvoices(newInvoices);
      }
    }
    return updatedClient;
  },

  deleteClient: (clientId) => {
    const clients = storageService.getClients();
    const filtered = clients.filter(c => c.id !== clientId);
    storageService.saveClients(filtered);
  },

  // Invoices CRUD
  getInvoices: () => {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(SEED_INVOICES));
      return SEED_INVOICES;
    }
    return JSON.parse(data);
  },

  saveInvoices: (invoices) => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  addInvoice: (invoiceData) => {
    const invoices = storageService.getInvoices();
    const newInvoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString()
    };
    invoices.unshift(newInvoice);
    storageService.saveInvoices(invoices);
    return newInvoice;
  },

  updateInvoice: (updatedInvoice) => {
    const invoices = storageService.getInvoices();
    const index = invoices.findIndex(i => i.id === updatedInvoice.id);
    if (index !== -1) {
      invoices[index] = {
        ...updatedInvoice,
        lastEditedAt: new Date().toISOString()
      };
      storageService.saveInvoices(invoices);
    }
    return invoices[index];
  },

  deleteInvoice: (invoiceId) => {
    const invoices = storageService.getInvoices();
    const filtered = invoices.filter(i => i.id !== invoiceId);
    storageService.saveInvoices(filtered);
  },

  getNextInvoiceNumber: () => {
    const invoices = storageService.getInvoices();
    const year = new Date().getFullYear();
    const prefix = `TSW-${year}-`;
    
    // Find maximum numeric sequence
    let maxSeq = 0;
    invoices.forEach(inv => {
      if (inv.invoiceNumber && inv.invoiceNumber.includes(prefix)) {
        const parts = inv.invoiceNumber.split('-');
        const seq = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    });
    
    const nextSeq = String(maxSeq + 1).padStart(3, '0');
    return `${prefix}${nextSeq}`;
  },

  // Settings
  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(data);
  },

  saveSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Reset to factory seed data
  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SEED_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(SEED_INVOICES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
};
