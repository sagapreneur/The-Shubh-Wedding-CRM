import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Send, 
  Edit3, 
  FileCheck, 
  FileText, 
  BellRing, 
  Paperclip,
  CheckCircle2,
  Info
} from 'lucide-react';
import A4Document from './A4Document';
import { downloadElementAsPdf } from '../../utils/pdf';
import { buildShareDocumentWhatsAppUrl, buildReminderWhatsAppUrl } from '../../utils/whatsapp';

export default function InvoicePreviewModal({ 
  isOpen, 
  onClose, 
  invoice, 
  settings, 
  onEditInvoice 
}) {
  const [isReceipt, setIsReceipt] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showWhatsAppNotice, setShowWhatsAppNotice] = useState(false);
  const docRef = useRef(null);

  if (!isOpen || !invoice) return null;

  const hasPayment = Number(invoice.amountPaid) > 0;

  const handleDownloadPdf = async () => {
    if (!docRef.current) return;
    setIsGeneratingPdf(true);
    const docType = isReceipt ? 'Receipt' : 'Invoice';
    const filename = `${docType}_${invoice.invoiceNumber}_${invoice.clientName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    await downloadElementAsPdf(docRef.current, filename);
    setIsGeneratingPdf(false);
  };

  const handleSendWhatsApp = async (e) => {
    e.preventDefault();
    setShowWhatsAppNotice(true);
    
    // Auto-download PDF first
    await handleDownloadPdf();

    // Open WhatsApp deep link
    const shareWhatsAppUrl = buildShareDocumentWhatsAppUrl({
      clientPhone: invoice.clientWhatsapp,
      clientName: invoice.clientName,
      invoiceNumber: invoice.invoiceNumber,
      service: invoice.clientService,
      grandTotal: invoice.grandTotal,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue,
      isReceipt
    });

    window.open(shareWhatsAppUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Reminder URL
  const reminderWhatsAppUrl = buildReminderWhatsAppUrl({
    clientPhone: invoice.clientWhatsapp,
    clientName: invoice.clientName,
    invoiceNumber: invoice.invoiceNumber,
    service: invoice.clientService,
    balanceDue: invoice.balanceDue,
    customTemplate: settings?.reminderTemplate
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-tsw-ink/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-tsw-bg rounded-xl sm:rounded-2xl max-w-4xl w-full border border-tsw-border shadow-tsw-modal overflow-hidden flex flex-col h-[94vh]">
        
        {/* Top Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 bg-white border-b border-tsw-border shrink-0">
          
          {/* Mode Switcher: Invoice vs Receipt */}
          <div className="flex items-center space-x-1 bg-tsw-bg p-1 rounded-xl border border-tsw-border">
            <button
              onClick={() => setIsReceipt(false)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isReceipt
                  ? 'bg-tsw-gold text-white shadow-sm'
                  : 'text-tsw-muted hover:text-tsw-ink'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoice</span>
            </button>

            <button
              onClick={() => setIsReceipt(true)}
              disabled={!hasPayment}
              title={!hasPayment ? 'Receipt available after payment is received' : 'View Payment Receipt'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isReceipt
                  ? 'bg-tsw-sage text-white shadow-sm'
                  : hasPayment 
                    ? 'text-tsw-muted hover:text-tsw-ink' 
                    : 'text-tsw-border cursor-not-allowed opacity-50'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Receipt {hasPayment ? '' : '(No payment)'}</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Edit Invoice Button */}
            <button
              onClick={() => {
                onClose();
                onEditInvoice(invoice);
              }}
              className="p-2 rounded-xl border border-tsw-border text-tsw-ink hover:bg-tsw-subtle transition-colors text-xs font-semibold flex items-center gap-1.5"
              title="Edit Invoice Fields"
            >
              <Edit3 className="w-4 h-4 text-tsw-gold" />
              <span className="hidden md:inline">Edit</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-tsw-border text-tsw-ink hover:bg-tsw-subtle transition-colors text-xs font-semibold flex items-center gap-1.5"
              title="Print A4 Page"
            >
              <Printer className="w-4 h-4 text-tsw-ink/70" />
              <span className="hidden md:inline">Print</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 py-2 rounded-xl bg-tsw-gold text-white hover:bg-tsw-gold-hover transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>

            {/* WhatsApp Send Button */}
            <button
              onClick={handleSendWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-tsw-sage text-white hover:bg-tsw-sage-dark transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title="Send Invoice/Receipt on WhatsApp"
            >
              <Send className="w-4 h-4" />
              <span>Send on WhatsApp</span>
            </button>

            {/* Send Reminder (If Balance > 0) */}
            {Number(invoice.balanceDue) > 0 && (
              <a
                href={reminderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-tsw-terracotta text-white hover:bg-tsw-terracotta-dark transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                title="Send Payment Reminder over WhatsApp"
              >
                <BellRing className="w-4 h-4" />
                <span className="hidden md:inline">Remind</span>
              </a>
            )}

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Informational WhatsApp Banner helper if triggered */}
        {showWhatsAppNotice && (
          <div className="bg-tsw-gold-light border-b border-tsw-gold/30 px-4 py-2.5 text-xs text-tsw-gold-dark flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-tsw-gold-dark flex-shrink-0" />
              <span>
                <strong>PDF downloaded & WhatsApp opened!</strong> Click the attachment (📎) icon in WhatsApp to select the downloaded PDF.
              </span>
            </div>
            <button 
              onClick={() => setShowWhatsAppNotice(false)}
              className="text-tsw-gold-dark hover:text-tsw-ink font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable A4 Document Container with mobile responsive scaling */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 flex justify-center bg-tsw-bg">
          <div className="w-full max-w-[210mm] transform-gpu scale-95 sm:scale-100 origin-top">
            <A4Document 
              invoice={invoice} 
              settings={settings} 
              isReceipt={isReceipt} 
              documentRef={docRef} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
