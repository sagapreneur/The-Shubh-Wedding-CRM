import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Send, 
  BellRing, 
  Copy, 
  Trash2, 
  Filter 
} from 'lucide-react';
import { INVOICE_STATUSES } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeStyle } from '../../utils/format';
import { buildReminderWhatsAppUrl } from '../../utils/whatsapp';

export default function InvoiceList({ 
  invoices = [], 
  settings, 
  onNewInvoice, 
  onViewInvoice, 
  onEditInvoice, 
  onDuplicateInvoice, 
  onDeleteInvoice 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Status filter
      if (selectedStatus !== 'ALL' && inv.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q) ||
          inv.clientService.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [invoices, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Search/Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tsw-ink tracking-tight">
            Studio Invoices
          </h1>
          <p className="text-xs sm:text-sm text-tsw-muted mt-1">
            Create, manage, print A4 PDFs, and send payment reminders over WhatsApp
          </p>
        </div>

        <button
          onClick={onNewInvoice}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-tsw-gold text-white text-xs sm:text-sm font-semibold hover:bg-tsw-gold-hover transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-tsw-border shadow-tsw-card">
        
        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === 'ALL'
                ? 'bg-tsw-gold text-white shadow-sm'
                : 'text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle'
            }`}
          >
            All ({invoices.length})
          </button>

          {Object.values(INVOICE_STATUSES).map(st => {
            const count = invoices.filter(i => i.status === st).length;
            const isActive = selectedStatus === st;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-tsw-gold text-white shadow-sm'
                    : 'text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search invoice #, client, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm focus:outline-none focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold bg-white"
          />
        </div>

      </div>

      {/* Invoices Data Table */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-tsw-border p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-tsw-card">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-tsw-gold-light text-tsw-gold flex items-center justify-center mx-auto">
            <FileText className="w-7 sm:w-8 h-7 sm:h-8" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-tsw-ink">No invoices found</h3>
            <p className="text-xs text-tsw-muted mt-1">
              {searchQuery || selectedStatus !== 'ALL'
                ? 'Try resetting search or status filters.'
                : 'Click below to create your first client invoice.'}
            </p>
          </div>
          <button
            onClick={onNewInvoice}
            className="px-4 py-2 bg-tsw-gold text-white text-xs font-semibold rounded-xl hover:bg-tsw-gold-hover transition-all"
          >
            + Create New Invoice
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-tsw-border shadow-tsw-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[750px]">
              <thead className="bg-tsw-bg text-tsw-muted uppercase text-[10px] sm:text-[11px] font-bold tracking-wider border-b border-tsw-border">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Invoice #</th>
                  <th className="py-3.5 px-4 sm:px-6">Client Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Invoice Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Grand Total</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Paid</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Balance Due</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tsw-border">
                {filteredInvoices.map((inv) => {
                  const badge = getStatusBadgeStyle(inv.status);
                  const reminderUrl = buildReminderWhatsAppUrl({
                    clientPhone: inv.clientWhatsapp,
                    clientName: inv.clientName,
                    invoiceNumber: inv.invoiceNumber,
                    service: inv.clientService,
                    balanceDue: inv.balanceDue,
                    customTemplate: settings?.reminderTemplate
                  });

                  return (
                    <tr key={inv.id} className="hover:bg-tsw-subtle/50 transition-colors group">
                      
                      {/* Invoice # */}
                      <td className="py-3.5 px-4 sm:px-6 font-semibold font-mono text-tsw-gold">
                        #{inv.invoiceNumber}
                      </td>

                      {/* Client Name & Service */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-semibold text-tsw-ink block">{inv.clientName}</span>
                        <span className="text-xs text-tsw-muted truncate block max-w-xs">{inv.clientService}</span>
                      </td>

                      {/* Invoice Date */}
                      <td className="py-3.5 px-4 sm:px-6 text-xs text-tsw-muted">
                        <div>{formatDate(inv.invoiceDate)}</div>
                        <div className="text-[10px] text-tsw-muted/80">Due: {formatDate(inv.dueDate)}</div>
                      </td>

                      {/* Grand Total */}
                      <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-tsw-ink font-serif">
                        {formatCurrency(inv.grandTotal)}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 sm:px-6 text-right text-tsw-sage font-medium">
                        {formatCurrency(inv.amountPaid)}
                      </td>

                      {/* Balance Due */}
                      <td className="py-3.5 px-4 sm:px-6 text-right text-tsw-terracotta font-bold">
                        {formatCurrency(inv.balanceDue)}
                      </td>

                      {/* Status Chip */}
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          {inv.status}
                        </span>
                      </td>

                      {/* Quick Action Icons */}
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          
                          {/* View / Print A4 PDF */}
                          <button
                            onClick={() => onViewInvoice(inv)}
                            className="p-1.5 rounded-lg text-tsw-ink/70 hover:text-tsw-gold hover:bg-tsw-gold-light transition-colors"
                            title="View / Print A4 PDF"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Invoice */}
                          <button
                            onClick={() => onEditInvoice(inv)}
                            className="p-1.5 rounded-lg text-tsw-ink/70 hover:text-tsw-gold hover:bg-tsw-gold-light transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Send WhatsApp Reminder if Balance > 0 */}
                          {Number(inv.balanceDue) > 0 && (
                            <a
                              href={reminderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-tsw-sage-dark hover:bg-tsw-sage-light transition-colors"
                              title="Send WhatsApp Payment Reminder"
                            >
                              <BellRing className="w-4 h-4" />
                            </a>
                          )}

                          {/* Duplicate Invoice */}
                          <button
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 rounded-lg text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle transition-colors"
                            title="Duplicate Invoice"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete Invoice */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete invoice #${inv.invoiceNumber} permanently?`)) {
                                onDeleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-tsw-muted hover:text-tsw-brick hover:bg-tsw-brick-light transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
