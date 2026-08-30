/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} name
 * @property {string} service
 * @property {number} amount
 * @property {string} address
 * @property {string} whatsappNumber
 * @property {string} [email]
 * @property {string} [notes]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} InvoiceLineItem
 * @property {string} id
 * @property {string} description
 * @property {number} quantity
 * @property {number} rate
 * @property {number} amount
 * @property {number} sortOrder
 */

/**
 * @typedef {Object} Invoice
 * @property {string} id
 * @property {string} invoiceNumber
 * @property {string} clientId
 * @property {string} clientName
 * @property {string} clientService
 * @property {string} clientAddress
 * @property {string} clientWhatsapp
 * @property {string} [clientEmail]
 * @property {string} invoiceDate
 * @property {string} dueDate
 * @property {'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue'} status
 * @property {InvoiceLineItem[]} items
 * @property {number} subtotal
 * @property {'flat' | 'percent'} discountType
 * @property {number} discountValue
 * @property {number} discount
 * @property {boolean} enableTax
 * @property {number} taxPercent
 * @property {number} taxAmount
 * @property {number} grandTotal
 * @property {number} amountPaid
 * @property {number} balanceDue
 * @property {'Cash' | 'UPI' | 'Bank Transfer' | 'Other' | ''} paymentMode
 * @property {string} [paymentNote]
 * @property {string} notes
 * @property {string} lastEditedAt
 * @property {string} createdAt
 */

/**
 * @typedef {Object} StudioSettings
 * @property {string} studioName
 * @property {string} tagline
 * @property {string} logoUrl
 * @property {string} address
 * @property {string} phone
 * @property {string} email
 * @property {string} [gstin]
 * @property {string} defaultTerms
 * @property {number} defaultTaxPercent
 * @property {boolean} taxEnabledByDefault
 * @property {string} reminderTemplate
 * @property {string} invoiceShareTemplate
 */

export const INVOICE_STATUSES = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  PARTIALLY_PAID: 'Partially Paid',
  PAID: 'Paid',
  OVERDUE: 'Overdue'
};

export const COMMON_SERVICES = [
  'Full Wedding Photography & Cinematography',
  'Pre-Wedding Concept Shoot',
  'Engagement & Haldi Coverage',
  'Reception & Sangeet Evening',
  'Traditional Candid Photography',
  'Drone Aerial Cinematography',
  'Luxury Photobook Album (40 Pages)',
  'Same Day Edit Teaser Video'
];
