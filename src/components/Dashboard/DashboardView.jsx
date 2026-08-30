import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, 
  Clock, 
  Users, 
  FileText, 
  Send, 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  Clock3 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { formatCurrency, formatDate, getStatusBadgeStyle } from '../../utils/format';
import { buildReminderWhatsAppUrl } from '../../utils/whatsapp';

export default function DashboardView({ 
  clients = [], 
  invoices = [], 
  settings, 
  onViewInvoice, 
  onNewInvoice, 
  onSelectClient 
}) {
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'this_month'

  // Calculate metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filteredInvoices = timeFilter === 'this_month'
      ? invoices.filter(inv => {
          const d = new Date(inv.invoiceDate);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
      : invoices;

    const totalCollected = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.amountPaid) || 0), 0);
    const totalPending = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.balanceDue) || 0), 0);
    const totalInvoicedAmount = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.grandTotal) || 0), 0);

    const counts = {
      total: invoices.length,
      paid: invoices.filter(i => i.status === 'Paid').length,
      partiallyPaid: invoices.filter(i => i.status === 'Partially Paid').length,
      pending: invoices.filter(i => i.status === 'Sent' || i.status === 'Draft').length,
      overdue: invoices.filter(i => i.status === 'Overdue').length
    };

    return {
      totalCollected,
      totalPending,
      totalInvoicedAmount,
      clientCount: clients.length,
      counts
    };
  }, [invoices, clients, timeFilter]);

  // Chart data: revenue over last 6 months
  const chartData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const yearLabel = d.getFullYear();
      const monthNum = d.getMonth();
      const yearNum = d.getFullYear();

      // Find revenue collected in this month
      const collected = invoices.reduce((sum, inv) => {
        const invDate = new Date(inv.invoiceDate);
        if (invDate.getMonth() === monthNum && invDate.getFullYear() === yearNum) {
          return sum + (Number(inv.amountPaid) || 0);
        }
        return sum;
      }, 0);

      months.push({
        name: `${monthLabel} ${yearLabel.toString().slice(-2)}`,
        collected: Math.round(collected / 1000), // in Thousands for clean axis
        fullAmount: collected
      });
    }

    return months;
  }, [invoices]);

  // Pending payments (oldest first)
  const pendingInvoices = useMemo(() => {
    return invoices
      .filter(inv => Number(inv.balanceDue) > 0 && inv.status !== 'Draft')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [invoices]);

  // Recent Invoices (last 5)
  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
      .slice(0, 5);
  }, [invoices]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      
      {/* Top Header & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tsw-ink tracking-tight">
            Studio Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-tsw-muted mt-1">
            Business overview, collection status, and WhatsApp payment reminders
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-tsw-border shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeFilter === 'all'
                ? 'bg-tsw-gold-light text-tsw-gold-dark shadow-sm'
                : 'text-tsw-muted hover:text-tsw-ink'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('this_month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeFilter === 'this_month'
                ? 'bg-tsw-gold-light text-tsw-gold-dark shadow-sm'
                : 'text-tsw-muted hover:text-tsw-ink'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Revenue Collected */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-tsw-border shadow-tsw-card hover:shadow-tsw-soft transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-tsw-sage-dark bg-tsw-sage-light px-2.5 py-1 rounded-full">
              Collected
            </span>
            <div className="p-2 sm:p-2.5 bg-tsw-sage-light rounded-xl text-tsw-sage-dark">
              <IndianRupee className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-tsw-ink block truncate">
              {formatCurrency(metrics.totalCollected)}
            </span>
            <span className="text-xs text-tsw-muted mt-1 block">
              {timeFilter === 'this_month' ? 'Collected this month' : 'Total revenue collected'}
            </span>
          </div>
        </div>

        {/* Card 2: Pending Amount */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-tsw-border shadow-tsw-card hover:shadow-tsw-soft transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-tsw-terracotta-dark bg-tsw-terracotta-light px-2.5 py-1 rounded-full">
              Pending
            </span>
            <div className="p-2 sm:p-2.5 bg-tsw-terracotta-light rounded-xl text-tsw-terracotta-dark">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-tsw-ink block truncate">
              {formatCurrency(metrics.totalPending)}
            </span>
            <span className="text-xs text-tsw-muted mt-1 block">
              Awaiting payment across clients
            </span>
          </div>
        </div>

        {/* Card 3: Total Clients */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-tsw-border shadow-tsw-card hover:shadow-tsw-soft transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-tsw-gold-dark bg-tsw-gold-light px-2.5 py-1 rounded-full">
              Clients
            </span>
            <div className="p-2 sm:p-2.5 bg-tsw-gold-light rounded-xl text-tsw-gold-dark">
              <Users className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-tsw-ink block">
              {metrics.clientCount}
            </span>
            <span className="text-xs text-tsw-muted mt-1 block">
              Total studio client records
            </span>
          </div>
        </div>

        {/* Card 4: Invoices Breakdown */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-tsw-border shadow-tsw-card hover:shadow-tsw-soft transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-tsw-ink/70 bg-tsw-subtle px-2.5 py-1 rounded-full">
              Invoices
            </span>
            <div className="p-2 sm:p-2.5 bg-tsw-subtle rounded-xl text-tsw-ink">
              <FileText className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 divide-x divide-tsw-border text-center text-xs">
            <div>
              <span className="block text-base sm:text-lg font-bold text-tsw-sage">{metrics.counts.paid}</span>
              <span className="text-[10px] sm:text-xs text-tsw-muted">Paid</span>
            </div>
            <div>
              <span className="block text-base sm:text-lg font-bold text-tsw-gold">{metrics.counts.partiallyPaid}</span>
              <span className="text-[10px] sm:text-xs text-tsw-muted">Partial</span>
            </div>
            <div>
              <span className="block text-base sm:text-lg font-bold text-tsw-brick">{metrics.counts.overdue}</span>
              <span className="text-[10px] sm:text-xs text-tsw-muted">Overdue</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Revenue Chart & Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left 2 Cols: Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-tsw-border shadow-tsw-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-tsw-ink flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-tsw-gold" />
                Revenue Collection Trend
              </h2>
              <p className="text-xs text-tsw-muted mt-0.5">
                Monthly revenue collected over the last 6 months (in ₹ Thousands)
              </p>
            </div>
          </div>

          <div className="h-56 sm:h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8A857D', fontSize: 11 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8A857D', fontSize: 11 }}
                  tickFormatter={(val) => `₹${val}k`}
                />
                <Tooltip 
                  formatter={(value, name, item) => [formatCurrency(item.payload.fullAmount), 'Collected']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #EAE5DE', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="collected" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? '#B8935F' : '#EAE5DE'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Pending Payments Quick Reminder Action */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-tsw-border shadow-tsw-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-tsw-border">
              <h2 className="text-base sm:text-lg font-serif font-bold text-tsw-ink flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-tsw-terracotta" />
                Pending Payments
              </h2>
              <span className="text-xs font-bold text-tsw-terracotta bg-tsw-terracotta-light px-2.5 py-0.5 rounded-full">
                {pendingInvoices.length} Due
              </span>
            </div>

            <div className="divide-y divide-tsw-border mt-2 max-h-[300px] overflow-y-auto pr-1">
              {pendingInvoices.length === 0 ? (
                <div className="py-8 text-center text-tsw-muted text-xs sm:text-sm">
                  <CheckCircle2 className="w-8 h-8 text-tsw-sage mx-auto mb-2 opacity-80" />
                  All caught up! No pending payments.
                </div>
              ) : (
                pendingInvoices.map((inv) => {
                  const reminderUrl = buildReminderWhatsAppUrl({
                    clientPhone: inv.clientWhatsapp,
                    clientName: inv.clientName,
                    invoiceNumber: inv.invoiceNumber,
                    service: inv.clientService,
                    balanceDue: inv.balanceDue,
                    customTemplate: settings?.reminderTemplate
                  });

                  return (
                    <div key={inv.id} className="py-3 flex items-center justify-between gap-3 group">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-mono text-tsw-gold">#{inv.invoiceNumber}</span>
                          {inv.status === 'Overdue' && (
                            <span className="text-[9px] px-1.5 py-0.2 font-bold bg-tsw-brick-light text-tsw-brick rounded uppercase">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-tsw-ink truncate mt-0.5">
                          {inv.clientName}
                        </p>
                        <p className="text-[11px] text-tsw-muted">
                          Due: {formatDate(inv.dueDate)}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="block text-xs sm:text-sm font-bold text-tsw-ink font-serif">
                          {formatCurrency(inv.balanceDue)}
                        </span>
                        <a
                          href={reminderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-tsw-sage-dark bg-tsw-sage-light hover:bg-tsw-sage hover:text-white px-2.5 py-1 rounded-lg transition-all"
                          title="Send WhatsApp Payment Reminder"
                        >
                          <Send className="w-3 h-3" />
                          <span>Remind</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => onNewInvoice()}
            className="w-full py-2.5 px-4 bg-tsw-subtle hover:bg-tsw-gold-light text-tsw-ink hover:text-tsw-gold-dark text-xs font-semibold rounded-xl transition-all text-center border border-tsw-border"
          >
            + Create New Invoice
          </button>
        </div>

      </div>

      {/* Recent Invoices Table (Mobile Responsive Horizontal Scroll) */}
      <div className="bg-white rounded-2xl border border-tsw-border shadow-tsw-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-tsw-border flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-tsw-ink">Recent Invoices</h2>
            <p className="text-xs text-tsw-muted">Latest invoices generated across all clients</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-tsw-bg text-tsw-muted uppercase text-[10px] sm:text-[11px] font-bold tracking-wider border-b border-tsw-border">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Invoice #</th>
                <th className="py-3.5 px-4 sm:px-6">Client</th>
                <th className="py-3.5 px-4 sm:px-6">Date</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Total</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Paid</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Balance</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tsw-border">
              {recentInvoices.map((inv) => {
                const badge = getStatusBadgeStyle(inv.status);
                return (
                  <tr key={inv.id} className="hover:bg-tsw-subtle/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold font-mono text-tsw-gold">
                      #{inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-tsw-ink">
                      {inv.clientName}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-tsw-muted text-xs">
                      {formatDate(inv.invoiceDate)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-tsw-ink font-serif">
                      {formatCurrency(inv.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right text-tsw-sage font-medium">
                      {formatCurrency(inv.amountPaid)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right text-tsw-terracotta font-semibold">
                      {formatCurrency(inv.balanceDue)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="p-1.5 rounded-lg text-tsw-muted hover:text-tsw-gold hover:bg-tsw-gold-light transition-colors"
                        title="View / Print Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
