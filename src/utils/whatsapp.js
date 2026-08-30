import { formatCurrency } from './format';

/**
 * Normalizes phone number into international format for wa.me link (e.g. 919876543210)
 * @param {string} phone 
 * @returns {string}
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove spaces, hyphens, brackets, leading plus
  let cleaned = phone.replace(/[^0-9]/g, '');
  
  // If 10 digits (standard Indian mobile number without country code), prepend 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  return cleaned;
};

/**
 * Generates wa.me URL for payment reminder
 * @param {Object} params
 * @returns {string}
 */
export const buildReminderWhatsAppUrl = ({
  clientPhone,
  clientName,
  invoiceNumber,
  service,
  balanceDue,
  customTemplate
}) => {
  const phone = normalizePhoneNumber(clientPhone);
  const formattedBalance = formatCurrency(balanceDue);
  
  let message = customTemplate || 
    `Hi {Client Name}, this is a gentle reminder that {Balance Due} is pending for Invoice #{Invoice No.} ({Service}) with The Shubh Wedding. Kindly complete the payment at your convenience. Thank you! 🙏`;
    
  message = message
    .replace(/{Client Name}/g, clientName || 'Client')
    .replace(/{Balance Due}/g, formattedBalance)
    .replace(/{Invoice No.}/g, invoiceNumber || '')
    .replace(/{Service}/g, service || 'Services');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates text message for invoice or receipt sharing
 * @param {Object} params
 * @returns {string}
 */
export const getShareTextMessage = ({
  clientName,
  invoiceNumber,
  service,
  grandTotal,
  amountPaid,
  balanceDue,
  isReceipt = false
}) => {
  if (isReceipt) {
    return `Hi ${clientName || 'Valued Client'}, thank you for your payment! Please find attached your payment RECEIPT for Invoice #${invoiceNumber} (${service}).\n\n` +
      `• Amount Received: ${formatCurrency(amountPaid)}\n` +
      `• Remaining Balance: ${formatCurrency(balanceDue)}\n\n` +
      `Thank you for choosing The Shubh Wedding! 🙏`;
  }
  return `Hi ${clientName || 'Valued Client'}, please find attached your Invoice #${invoiceNumber} for ${service} with The Shubh Wedding.\n\n` +
    `• Invoice Amount: ${formatCurrency(grandTotal)}\n` +
    `• Amount Paid: ${formatCurrency(amountPaid)}\n` +
    `• Balance Due: ${formatCurrency(balanceDue)}\n\n` +
    `Kindly let us know if you have any questions. Thank you! 🙏`;
};

/**
 * Generates wa.me URL for sharing an Invoice or Receipt PDF
 * @param {Object} params
 * @returns {string}
 */
export const buildShareDocumentWhatsAppUrl = (params) => {
  const phone = normalizePhoneNumber(params.clientPhone);
  const message = getShareTextMessage(params);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

