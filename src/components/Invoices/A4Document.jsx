import React from 'react';
import { formatCurrency, formatDate } from '../../utils/format';

/**
 * Print-ready A4 Document Component for Invoices & Receipts
 * Styled precisely like a luxury wedding studio letterhead on standard A4 page (210mm x 297mm)
 */
export default function A4Document({ 
  invoice, 
  settings, 
  isReceipt = false, 
  documentRef = null 
}) {
  if (!invoice) return null;

  const studioName = settings?.studioName || 'The Shubh Wedding';
  const logoUrl = settings?.logoUrl || '/Logo-01.png';
  const studioAddress = settings?.address || 'Defence Colony, New Delhi 110024';
  const studioPhone = settings?.phone || '+91 98100 87654';
  const studioEmail = settings?.email || 'inquiries@theshubhwedding.com';
  const gstin = settings?.gstin || '';

  const docTitle = isReceipt ? 'RECEIPT' : 'INVOICE';

  return (
    <div 
      ref={documentRef}
      id="a4-print-container"
      className="a4-document-page bg-white text-tsw-ink font-sans p-5 sm:p-8 w-full max-w-[210mm] min-h-[297mm] mx-auto flex flex-col justify-between shadow-tsw-modal rounded-xl sm:rounded-2xl border border-tsw-border print:border-none print:shadow-none print:p-0 print:m-0 print:w-full shrink-0 box-border"
    >
      <div className="space-y-5 sm:space-y-6">
        
        {/* 1. Studio Letterhead Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-tsw-border pb-4 sm:pb-6">
          
          {/* Logo & Studio Info */}
          <div className="space-y-2 max-w-full sm:max-w-sm">
            <img 
              src={logoUrl} 
              alt={studioName} 
              className="h-12 sm:h-14 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/public/Logo-01.png';
              }}
            />
            <div className="text-[11px] sm:text-xs text-tsw-muted leading-relaxed">
              <p className="font-bold text-tsw-ink text-xs sm:text-sm">{studioName}</p>
              <p>{studioAddress}</p>
              <p>Phone: {studioPhone} | Email: {studioEmail}</p>
              {gstin && <p className="mt-0.5 font-semibold text-tsw-ink">GSTIN: {gstin}</p>}
            </div>
          </div>

          {/* Document Title & Meta Header */}
          <div className="w-full sm:w-auto text-left sm:text-right space-y-1.5">
            <span className="inline-block text-2xl sm:text-3xl font-serif font-bold tracking-widest text-tsw-ink uppercase">
              {docTitle}
            </span>
            <div className="text-[11px] sm:text-xs text-tsw-ink space-y-0.5 bg-tsw-bg p-2.5 rounded-xl border border-tsw-border text-left sm:text-right">
              <p><span className="text-tsw-muted">Document #:</span> <strong className="font-mono text-tsw-gold font-bold">{invoice.invoiceNumber}</strong></p>
              <p><span className="text-tsw-muted">Date:</span> {formatDate(invoice.invoiceDate)}</p>
              <p><span className="text-tsw-muted">Due Date:</span> {formatDate(invoice.dueDate)}</p>
              {isReceipt && invoice.paymentMode && (
                <p><span className="text-tsw-muted">Payment Mode:</span> <strong className="text-tsw-sage-dark">{invoice.paymentMode}</strong></p>
              )}
            </div>
          </div>

        </div>

        {/* 2. Client Billing Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-tsw-bg p-4 rounded-2xl border border-tsw-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-tsw-gold-dark block mb-1">
              Billed To:
            </span>
            <h3 className="text-sm sm:text-base font-serif font-bold text-tsw-ink">{invoice.clientName}</h3>
            <p className="text-xs text-tsw-muted mt-0.5 leading-relaxed">{invoice.clientAddress}</p>
          </div>

          <div className="text-left sm:text-right space-y-0.5 text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-tsw-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tsw-gold-dark block mb-1">
              Booking Info:
            </span>
            <p><span className="text-tsw-muted">Service:</span> <strong className="text-tsw-ink">{invoice.clientService}</strong></p>
            <p><span className="text-tsw-muted">WhatsApp:</span> {invoice.clientWhatsapp}</p>
            {invoice.clientEmail && <p><span className="text-tsw-muted">Email:</span> {invoice.clientEmail}</p>}
          </div>
        </div>

        {/* 3. Line Items Table */}
        <div className="overflow-x-auto border border-tsw-border rounded-2xl">
          <table className="w-full text-left text-xs min-w-[480px] sm:min-w-0">
            <thead className="bg-tsw-bg text-tsw-ink uppercase text-[10px] font-bold tracking-wider border-b border-tsw-border">
              <tr>
                <th className="py-2.5 px-3.5 w-10 text-center">#</th>
                <th className="py-2.5 px-3.5">Service Description</th>
                <th className="py-2.5 px-3.5 text-center w-16">Qty</th>
                <th className="py-2.5 px-3.5 text-right w-24 sm:w-28">Rate (₹)</th>
                <th className="py-2.5 px-3.5 text-right w-28 sm:w-32">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tsw-border bg-white">
              {invoice.items?.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-2.5 px-3.5 text-center text-tsw-muted font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3.5 font-medium text-tsw-ink leading-relaxed">
                    {item.description}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono">{item.quantity}</td>
                  <td className="py-2.5 px-3.5 text-right font-mono">{formatCurrency(item.rate)}</td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold text-tsw-ink">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Financial Totals & Payment Summary Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          
          {/* Left: Terms & Payment Remarks */}
          <div className="space-y-3 order-2 sm:order-1">
            {invoice.notes && (
              <div className="text-xs space-y-1">
                <span className="font-bold text-tsw-ink uppercase text-[10px] tracking-wider block">
                  Terms & Conditions / Studio Notes:
                </span>
                <p className="text-tsw-muted whitespace-pre-line leading-relaxed italic bg-tsw-bg p-3 rounded-xl border border-tsw-border text-[11px]">
                  {invoice.notes}
                </p>
              </div>
            )}

            {isReceipt && invoice.paymentNote && (
              <div className="text-xs bg-tsw-sage-light p-3 rounded-xl border border-tsw-sage/30 text-tsw-sage-dark">
                <span className="font-bold block uppercase text-[10px] tracking-wider mb-0.5">Payment Remark:</span>
                <p>{invoice.paymentNote}</p>
              </div>
            )}
          </div>

          {/* Right: Subtotal, Tax, Totals */}
          <div className="space-y-1 text-xs bg-tsw-bg p-3.5 rounded-2xl border border-tsw-border order-1 sm:order-2">
            <div className="flex justify-between py-0.5 border-b border-tsw-border text-tsw-muted">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-tsw-ink">{formatCurrency(invoice.subtotal)}</span>
            </div>

            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between py-0.5 border-b border-tsw-border text-tsw-terracotta font-medium">
                <span>Discount ({invoice.discountType === 'percent' ? `${invoice.discountValue}%` : 'Flat'}):</span>
                <span className="font-mono">- {formatCurrency(invoice.discount)}</span>
              </div>
            )}

            {invoice.enableTax && (
              <div className="flex justify-between py-0.5 border-b border-tsw-border text-tsw-muted">
                <span>GST / Tax ({invoice.taxPercent}%):</span>
                <span className="font-mono font-semibold text-tsw-ink">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}

            <div className="flex justify-between py-1.5 border-b-2 border-tsw-ink text-sm font-bold font-serif text-tsw-ink">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-tsw-gold font-serif">{formatCurrency(invoice.grandTotal)}</span>
            </div>

            <div className="flex justify-between py-0.5 text-tsw-sage-dark font-medium">
              <span>Amount Received:</span>
              <span className="font-mono font-bold">{formatCurrency(invoice.amountPaid)}</span>
            </div>

            <div className="flex justify-between py-0.5 text-tsw-terracotta-dark font-bold border-t border-tsw-border pt-1">
              <span>Balance Due:</span>
              <span className="font-mono text-sm">{formatCurrency(invoice.balanceDue)}</span>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Studio Footer Letterhead */}
      <div className="mt-4 pt-3 border-t border-tsw-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-tsw-muted gap-2">
        <div className="text-center sm:text-left">
          <p className="font-serif font-bold text-tsw-ink">Thank you for choosing The Shubh Wedding!</p>
          <p className="text-[10px] text-tsw-gold font-semibold uppercase tracking-widest mt-0.5">Luxury Wedding & Portrait Studio</p>
        </div>
        <div className="text-center sm:text-right italic text-[10px]">
          Computer-generated {docTitle.toLowerCase()} • Authorized Studio Letterhead
        </div>
      </div>

    </div>
  );
}
