import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Edit3, 
  Eye 
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function ClientList({ 
  clients = [], 
  invoices = [], 
  onAddClient, 
  onEditClient, 
  onSelectClient, 
  onNewInvoiceForClient 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Map invoices to clients for aggregated metrics
  const clientData = useMemo(() => {
    return clients.map(client => {
      const clientInvs = invoices.filter(inv => inv.clientId === client.id);
      const totalInvoiced = clientInvs.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
      const totalPending = clientInvs.reduce((sum, i) => sum + (Number(i.balanceDue) || 0), 0);
      
      const sortedInvs = [...clientInvs].sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
      const lastInvoiceDate = sortedInvs.length > 0 ? sortedInvs[0].invoiceDate : null;

      return {
        ...client,
        invoicesCount: clientInvs.length,
        totalInvoiced,
        totalPending,
        lastInvoiceDate
      };
    });
  }, [clients, invoices]);

  // Search filter
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clientData;
    const q = searchQuery.toLowerCase();
    return clientData.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.whatsappNumber.includes(q) ||
      c.service.toLowerCase().includes(q)
    );
  }, [clientData, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tsw-ink tracking-tight">
            Studio Clients
          </h1>
          <p className="text-xs sm:text-sm text-tsw-muted mt-1">
            Manage photography clients, agreed packages, and billing records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search name, phone, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm focus:outline-none focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold bg-white shadow-sm"
            />
          </div>

          <button
            onClick={onAddClient}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-tsw-gold text-white text-xs sm:text-sm font-semibold hover:bg-tsw-gold-hover transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Clients Cards / Table */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-tsw-border p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-tsw-card">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-tsw-gold-light text-tsw-gold flex items-center justify-center mx-auto">
            <Users className="w-7 sm:w-8 h-7 sm:h-8" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-tsw-ink">No clients found</h3>
            <p className="text-xs text-tsw-muted mt-1">
              {searchQuery ? 'Try matching a different keyword or phone number.' : 'Add your first client to start raising invoices.'}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={onAddClient}
              className="px-4 py-2 bg-tsw-gold text-white text-xs font-semibold rounded-xl hover:bg-tsw-gold-hover transition-all"
            >
              + Add First Client
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredClients.map((client) => {
            const cleanPhone = client.whatsappNumber.replace(/[^0-9]/g, '');

            return (
              <div 
                key={client.id}
                className="bg-white rounded-2xl border border-tsw-border p-5 sm:p-6 shadow-tsw-card hover:shadow-tsw-soft transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  
                  {/* Top Row: Initial avatar + name + actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-tsw-gold-light text-tsw-gold-dark font-serif font-bold text-base sm:text-lg flex items-center justify-center border border-tsw-gold/20 shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 
                          onClick={() => onSelectClient(client)}
                          className="font-serif font-bold text-sm sm:text-base text-tsw-ink hover:text-tsw-gold transition-colors cursor-pointer truncate"
                        >
                          {client.name}
                        </h3>
                        <span className="text-xs text-tsw-gold font-medium block truncate">
                          {client.service}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onEditClient(client)}
                      className="p-1.5 rounded-lg text-tsw-muted hover:text-tsw-gold hover:bg-tsw-subtle transition-colors shrink-0"
                      title="Edit Client"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 pt-3 border-t border-tsw-border space-y-2 text-xs text-tsw-ink">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-tsw-muted flex-shrink-0" />
                        <span className="truncate">{client.whatsappNumber}</span>
                      </div>
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tsw-sage-dark bg-tsw-sage-light hover:bg-tsw-sage hover:text-white px-2 py-0.5 rounded text-[11px] font-medium transition-all flex-shrink-0"
                        title="Chat on WhatsApp"
                      >
                        WhatsApp
                      </a>
                    </div>

                    {client.address && (
                      <div className="flex items-start space-x-2 text-tsw-muted">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Metrics Summary Pill */}
                  <div className="mt-4 p-3 bg-tsw-bg rounded-xl border border-tsw-border grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-tsw-muted uppercase tracking-wider block">Invoiced</span>
                      <span className="font-bold text-tsw-ink font-serif truncate block">
                        {formatCurrency(client.totalInvoiced)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-tsw-terracotta uppercase tracking-wider block font-semibold">Pending</span>
                      <span className="font-bold text-tsw-terracotta font-serif truncate block">
                        {formatCurrency(client.totalPending)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-tsw-border flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClient(client);
                    }}
                    className="flex-1 py-2 px-3 bg-tsw-subtle hover:bg-tsw-gold-light text-tsw-ink hover:text-tsw-gold-dark text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewInvoiceForClient(client);
                    }}
                    className="py-2 px-3 bg-tsw-gold hover:bg-tsw-gold-hover text-white text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm shrink-0 cursor-pointer"
                    title="Raise Invoice for Client"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
