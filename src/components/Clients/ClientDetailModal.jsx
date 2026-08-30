import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Plus, 
  MessageSquare, 
  Edit3, 
  Calendar, 
  IndianRupee 
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeStyle } from '../../utils/format';
import { buildReminderWhatsAppUrl } from '../../utils/whatsapp';

export default function ClientDetailModal({ 
  isOpen, 
  onClose, 
  client, 
  clientInvoices = [], 
  onEditClient, 
  onNewInvoiceForClient, 
  onViewInvoice 
}) {
  if (!isOpen || !client) return null;

  const totalInvoiced = clientInvoices.reduce((acc, inv) => acc + (Number(inv.grandTotal) || 0), 0);
  const totalPaid = clientInvoices.reduce((acc, inv) => acc + (Number(inv.amountPaid) || 0), 0);
  const totalPending = clientInvoices.reduce((acc, inv) => acc + (Number(inv.balanceDue) || 0), 0);

  const cleanPhone = client.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tsw-ink/50 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-tsw-border shadow-tsw-modal overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tsw-border bg-tsw-bg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-tsw-gold-light text-tsw-gold-dark flex items-center justify-center font-serif text-xl font-bold border border-tsw-gold/20">
              {client.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-tsw-ink">{client.name}</h2>
              <span className="text-xs text-tsw-muted block">{client.service}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onEditClient(client)}
              className="p-2 rounded-xl border border-tsw-border text-tsw-ink text-xs font-semibold hover:bg-tsw-subtle transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 text-tsw-gold" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Contact & Financial Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Contact Info */}
            <div className="bg-tsw-bg rounded-2xl p-5 border border-tsw-border space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-tsw-gold-dark mb-2">
                Client Profile Details
              </h3>

              <div className="flex items-start gap-3 text-xs text-tsw-ink">
                <Phone className="w-4 h-4 text-tsw-muted flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{client.whatsappNumber}</span>
                  <a 
                    href={`https://wa.me/${cleanPhone}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tsw-sage-dark font-medium hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <MessageSquare className="w-3 h-3" /> Open WhatsApp Chat
                  </a>
                </div>
              </div>

              {client.email && (
                <div className="flex items-center gap-3 text-xs text-tsw-ink">
                  <Mail className="w-4 h-4 text-tsw-muted flex-shrink-0" />
                  <span>{client.email}</span>
                </div>
              )}

              <div className="flex items-start gap-3 text-xs text-tsw-ink">
                <MapPin className="w-4 h-4 text-tsw-muted flex-shrink-0 mt-0.5" />
                <span>{client.address}</span>
              </div>

              {client.notes && (
                <div className="pt-2 border-t border-tsw-border text-xs text-tsw-muted">
                  <span className="font-semibold text-tsw-ink block mb-0.5">Notes:</span>
                  <p className="italic">{client.notes}</p>
                </div>
              )}
            </div>

            {/* Right: Billing Snapshot */}
            <div className="bg-tsw-bg rounded-2xl p-5 border border-tsw-border flex flex-col justify-between space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-tsw-gold-dark">
                Billing & Payment Snapshot
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-tsw-border">
                  <span className="text-[11px] text-tsw-muted block">Agreed Package</span>
                  <span className="text-base font-bold text-tsw-ink font-serif">
                    {formatCurrency(client.amount)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-tsw-border">
                  <span className="text-[11px] text-tsw-muted block">Total Invoiced</span>
                  <span className="text-base font-bold text-tsw-ink font-serif">
                    {formatCurrency(totalInvoiced)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-tsw-border">
                  <span className="text-[11px] text-tsw-sage-dark font-medium block">Total Paid</span>
                  <span className="text-base font-bold text-tsw-sage font-serif">
                    {formatCurrency(totalPaid)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-tsw-border">
                  <span className="text-[11px] text-tsw-terracotta-dark font-medium block">Balance Due</span>
                  <span className="text-base font-bold text-tsw-terracotta font-serif">
                    {formatCurrency(totalPending)}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  setTimeout(() => {
                    onNewInvoiceForClient(client);
                  }, 50);
                }}
                className="w-full py-2.5 px-4 bg-tsw-gold hover:bg-tsw-gold-hover text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Invoice for {client.name.split(' ')[0]}</span>
              </button>
            </div>

          </div>

          {/* Invoices History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-tsw-ink flex items-center gap-2">
                <FileText className="w-4 h-4 text-tsw-gold" />
                Invoice History ({clientInvoices.length})
              </h3>
            </div>

            {clientInvoices.length === 0 ? (
              <div className="p-8 text-center bg-tsw-bg rounded-2xl border border-tsw-border text-tsw-muted text-sm">
                No invoices raised for this client yet.
              </div>
            ) : (
              <div className="border border-tsw-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-tsw-bg text-tsw-muted uppercase text-[10px] font-semibold border-b border-tsw-border">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Grand Total</th>
                      <th className="py-3 px-4 text-right">Amount Paid</th>
                      <th className="py-3 px-4 text-right">Balance Due</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tsw-border">
                    {clientInvoices.map((inv) => {
                      const badge = getStatusBadgeStyle(inv.status);
                      return (
                        <tr key={inv.id} className="hover:bg-tsw-subtle/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-tsw-gold">
                            #{inv.invoiceNumber}
                          </td>
                          <td className="py-3 px-4 text-tsw-muted">
                            {formatDate(inv.invoiceDate)}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-tsw-ink">
                            {formatCurrency(inv.grandTotal)}
                          </td>
                          <td className="py-3 px-4 text-right text-tsw-sage font-medium">
                            {formatCurrency(inv.amountPaid)}
                          </td>
                          <td className="py-3 px-4 text-right text-tsw-terracotta font-semibold">
                            {formatCurrency(inv.balanceDue)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                onClose();
                                onViewInvoice(inv);
                              }}
                              className="px-2.5 py-1 bg-tsw-subtle hover:bg-tsw-gold-light text-tsw-ink hover:text-tsw-gold-dark rounded-lg transition-colors font-medium text-[11px]"
                            >
                              View / Print
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
