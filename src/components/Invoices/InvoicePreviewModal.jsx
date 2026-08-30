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
  Maximize2,
  ZoomIn,
  ZoomOut
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
  const [zoomLevel, setZoomLevel] = useState('auto'); // 'auto', 'fit', '100%'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-tsw-ink/70 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-tsw-bg sm:rounded-2xl w-full max-w-5xl border border-tsw-border shadow-tsw-modal overflow-hidden flex flex-col h-full sm:h-[94vh]">
        
        {/* Top Action Toolbar (Responsive Mobile & Desktop) */}
        <div className="bg-white border-b border-tsw-border p-2.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          
          {/* Left: Mode Switcher (Invoice vs Receipt) & Zoom Control */}
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            
            {/* Mode Switcher */}
            <div className="flex items-center space-x-1 bg-tsw-bg p-1 rounded-xl border border-tsw-border">
              <button
                onClick={() => setIsReceipt(false)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isReceipt
                    ? 'bg-tsw-sage text-white shadow-sm'
                    : hasPayment 
                      ? 'text-tsw-muted hover:text-tsw-ink' 
                      : 'text-tsw-border cursor-not-allowed opacity-50'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Receipt</span>
              </button>
            </div>

            {/* Mobile Viewport Zoom Controls */}
            <div className="flex items-center space-x-1 bg-tsw-bg p-1 rounded-xl border border-tsw-border">
              <button
                onClick={() => setZoomLevel(zoomLevel === '100%' ? 'auto' : '100%')}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  zoomLevel === '100%' ? 'bg-tsw-ink text-white' : 'text-tsw-muted hover:text-tsw-ink'
                }`}
                title={zoomLevel === '100%' ? 'Fit Screen View' : 'Zoom 100% Standard View'}
              >
                {zoomLevel === '100%' ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span className="text-[10px] uppercase font-bold">{zoomLevel === '100%' ? 'Fit' : '100%'}</span>
              </button>
            </div>

          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center justify-end space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-none py-0.5">
            
            {/* Edit Invoice Button */}
            <button
              onClick={() => {
                onClose();
                onEditInvoice(invoice);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-tsw-border text-tsw-ink hover:bg-tsw-subtle transition-colors text-xs font-semibold flex items-center gap-1.5 shrink-0"
              title="Edit Invoice Fields"
            >
              <Edit3 className="w-3.5 h-3.5 text-tsw-gold" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-tsw-border text-tsw-ink hover:bg-tsw-subtle transition-colors text-xs font-semibold flex items-center gap-1.5 shrink-0"
              title="Print A4 Page"
            >
              <Printer className="w-3.5 h-3.5 text-tsw-ink/70" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 py-2 rounded-xl bg-tsw-gold text-white hover:bg-tsw-gold-hover transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating...' : 'PDF'}</span>
            </button>

            {/* WhatsApp Send Button */}
            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-2 rounded-xl bg-tsw-sage text-white hover:bg-tsw-sage-dark transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0"
              title="Send Invoice/Receipt on WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Send Reminder (If Balance > 0) */}
            {Number(invoice.balanceDue) > 0 && (
              <a
                href={reminderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-tsw-terracotta text-white hover:bg-tsw-terracotta-dark transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0"
                title="Send Payment Reminder over WhatsApp"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remind</span>
              </a>
            )}

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle transition-colors ml-1 shrink-0"
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
                <strong>PDF downloaded & WhatsApp opened!</strong> Attach the downloaded PDF via WhatsApp's (📎) icon.
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

        {/* Scrollable & Responsive A4 Document Container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-6 bg-tsw-ink/5 flex justify-start sm:justify-center items-start">
          
          {/* Responsive Scaling Wrapper */}
          <div className={`transition-all duration-300 ${
            zoomLevel === '100%' 
              ? 'scale-100 origin-top-left sm:origin-top' 
              : 'scale-[0.44] xs:scale-[0.55] sm:scale-[0.80] md:scale-95 lg:scale-100 origin-top-left sm:origin-top my-[-160px] xs:my-[-110px] sm:my-[-30px] md:my-0'
          }`}>
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
