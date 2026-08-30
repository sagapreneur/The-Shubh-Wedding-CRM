import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Printer, 
  IndianRupee, 
  TrendingUp, 
  Users, 
  FileText 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/format';

export default function ReportsView({ clients = [], invoices = [] }) {
  const [dateFilter, setDateFilter] = useState('ALL'); // 'THIS_MONTH' | 'LAST_MONTH' | 'CUSTOM' | 'ALL'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtered invoices based on date range
  const filteredInvoices = useMemo(() => {
    const now = new Date();

    return invoices.filter(inv => {
      const invDate = new Date(inv.invoiceDate);

      if (dateFilter === 'THIS_MONTH') {
        return (
          invDate.getMonth() === now.getMonth() &&
          invDate.getFullYear() === now.getFullYear()
        );
      }

      if (dateFilter === 'LAST_MONTH') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (
          invDate.getMonth() === lastMonth.getMonth() &&
          invDate.getFullYear() === lastMonth.getFullYear()
        );
      }

      if (dateFilter === 'CUSTOM' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return invDate >= start && invDate <= end;
      }

      return true;
    });
  }, [invoices, dateFilter, startDate, endDate]);

  // Aggregated totals
  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (Number(inv.amountPaid) || 0), 0);
  const totalPending = filteredInvoices.reduce((sum, inv) => sum + (Number(inv.balanceDue) || 0), 0);
  const grandTotalInvoiced = filteredInvoices.reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);

  // Status distribution for pie chart
  const statusChartData = useMemo(() => {
    const counts = {
      Paid: 0,
      'Partially Paid': 0,
      Sent: 0,
      Draft: 0,
      Overdue: 0
    };

    filteredInvoices.forEach(inv => {
      if (counts[inv.status] !== undefined) {
        counts[inv.status] += 1;
      }
    });

    return [
      { name: 'Paid', value: counts['Paid'], color: '#5C8A6B' },
      { name: 'Partially Paid', value: counts['Partially Paid'], color: '#B8935F' },
      { name: 'Sent / Pending', value: counts['Sent'] + counts['Draft'], color: '#8A857D' },
      { name: 'Overdue', value: counts['Overdue'], color: '#B25454' }
    ].filter(item => item.value > 0);
  }, [filteredInvoices]);

  // Top clients by revenue
  const topClients = useMemo(() => {
    const clientRevenueMap = {};

    filteredInvoices.forEach(inv => {
      const key = inv.clientName;
      if (!clientRevenueMap[key]) {
        clientRevenueMap[key] = {
          name: inv.clientName,
          service: inv.clientService,
          paid: 0,
          pending: 0,
          invoicesCount: 0
        };
      }
      clientRevenueMap[key].paid += (Number(inv.amountPaid) || 0);
      clientRevenueMap[key].pending += (Number(inv.balanceDue) || 0);
      clientRevenueMap[key].invoicesCount += 1;
    });

    return Object.values(clientRevenueMap)
      .sort((a, b) => b.paid - a.paid)
      .slice(0, 5);
  }, [filteredInvoices]);

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) return;

    const headers = [
      'Invoice Number',
      'Client Name',
      'Service',
      'Invoice Date',
      'Due Date',
      'Status',
      'Grand Total (INR)',
      'Amount Paid (INR)',
      'Balance Due (INR)',
      'Payment Mode'
    ];

    const rows = filteredInvoices.map(inv => [
      `"${inv.invoiceNumber}"`,
      `"${inv.clientName.replace(/"/g, '""')}"`,
      `"${inv.clientService.replace(/"/g, '""')}"`,
      `"${inv.invoiceDate}"`,
      `"${inv.dueDate}"`,
      `"${inv.status}"`,
      inv.grandTotal,
      inv.amountPaid,
      inv.balanceDue,
      `"${inv.paymentMode || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TSW_Financial_Report_${dateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Date Range Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tsw-ink">
            Financial Reports
          </h1>
          <p className="text-sm text-tsw-muted mt-1">
            Studio revenue analysis, collection metrics, top clients, and CSV exports
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl border border-tsw-border text-tsw-ink hover:bg-tsw-subtle transition-all text-xs font-semibold flex items-center gap-1.5 bg-white shadow-sm"
          >
            <Printer className="w-4 h-4 text-tsw-muted" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-tsw-gold text-white hover:bg-tsw-gold-hover transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-tsw-border shadow-tsw-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setDateFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              dateFilter === 'ALL'
                ? 'bg-tsw-gold text-white shadow-sm'
                : 'text-tsw-muted hover:text-tsw-ink'
            }`}
          >
            All Time
          </button>

          <button
            onClick={() => setDateFilter('THIS_MONTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              dateFilter === 'THIS_MONTH'
                ? 'bg-tsw-gold text-white shadow-sm'
                : 'text-tsw-muted hover:text-tsw-ink'
            }`}
          >
            This Month
          </button>

          <button
            onClick={() => setDateFilter('LAST_MONTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              dateFilter === 'LAST_MONTH'
                ? 'bg-tsw-gold text-white shadow-sm'
                : 'text-tsw-muted hover:text-tsw-ink'
            }`}
          >
            Last Month
          </button>

          <button
            onClick={() => setDateFilter('CUSTOM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              dateFilter === 'CUSTOM'
                ? 'bg-tsw-gold text-white shadow-sm'
                : 'text-tsw-muted hover:text-tsw-ink'
            }`}
          >
            Custom Range
          </button>
        </div>

        {dateFilter === 'CUSTOM' && (
          <div className="flex items-center space-x-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-tsw-border focus:border-tsw-gold"
            />
            <span className="text-tsw-muted">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-tsw-border focus:border-tsw-gold"
            />
          </div>
        )}
      </div>

      {/* KPI Cards in Selected Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white rounded-2xl p-6 border border-tsw-border shadow-tsw-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-tsw-sage-dark bg-tsw-sage-light px-2.5 py-1 rounded-full">
            Revenue Collected
          </span>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-tsw-ink block">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-xs text-tsw-muted mt-1 block">
              Actual cash collected in selected period
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-tsw-border shadow-tsw-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-tsw-terracotta-dark bg-tsw-terracotta-light px-2.5 py-1 rounded-full">
            Pending Balance
          </span>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-tsw-ink block">
              {formatCurrency(totalPending)}
            </span>
            <span className="text-xs text-tsw-muted mt-1 block">
              Outstanding balance remaining
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-tsw-border shadow-tsw-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-tsw-gold-dark bg-tsw-gold-light px-2.5 py-1 rounded-full">
            Total Invoiced
          </span>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-tsw-ink block">
              {formatCurrency(grandTotalInvoiced)}
            </span>
            <span className="text-xs text-tsw-muted mt-1 block">
              Sum of all invoices raised ({filteredInvoices.length} invoices)
            </span>
          </div>
        </div>

      </div>

      {/* Charts & Top Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-tsw-border shadow-tsw-card space-y-4">
          <h2 className="text-lg font-serif font-semibold text-tsw-ink flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-tsw-gold" />
            Invoice Breakdown by Status
          </h2>

          <div className="h-64">
            {statusChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-tsw-muted text-xs">
                No data available for selected range
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`${val} invoices`, 'Count']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #EAE5DE' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Clients by Revenue Table */}
        <div className="bg-white rounded-2xl p-6 border border-tsw-border shadow-tsw-card space-y-4">
          <h2 className="text-lg font-serif font-semibold text-tsw-ink flex items-center gap-2">
            <Users className="w-5 h-5 text-tsw-gold" />
            Top Clients by Revenue
          </h2>

          <div className="divide-y divide-tsw-border">
            {topClients.length === 0 ? (
              <div className="py-8 text-center text-tsw-muted text-xs">
                No client revenue recorded yet
              </div>
            ) : (
              topClients.map((c, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-tsw-gold-light text-tsw-gold-dark font-serif font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-tsw-ink">{c.name}</p>
                      <p className="text-[10px] text-tsw-muted">{c.service}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-bold font-serif text-tsw-ink">
                      {formatCurrency(c.paid)}
                    </span>
                    {c.pending > 0 && (
                      <span className="text-[10px] text-tsw-terracotta block font-medium">
                        Pending: {formatCurrency(c.pending)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
