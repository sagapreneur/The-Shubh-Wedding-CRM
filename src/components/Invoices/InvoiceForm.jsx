import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  UserPlus, 
  Check 
} from 'lucide-react';
import { INVOICE_STATUSES } from '../../types';
import { formatCurrency } from '../../utils/format';
import confetti from 'canvas-confetti';

export default function InvoiceForm({ 
  isOpen, 
  onClose, 
  onSave, 
  invoiceToEdit = null, 
  clients = [], 
  settings, 
  onAddNewClientInline, 
  nextInvoiceNumber = 'TSW-2026-001' 
}) {
  const isEditing = Boolean(invoiceToEdit && invoiceToEdit.id);

  // Helper to build initial form state synchronously
  const buildInitialState = () => {
    const today = new Date().toISOString().split('T')[0];
    const twoWeeksLater = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    if (invoiceToEdit && invoiceToEdit.id) {
      // Editing existing invoice
      return {
        id: invoiceToEdit.id,
        invoiceNumber: invoiceToEdit.invoiceNumber || nextInvoiceNumber,
        clientId: invoiceToEdit.clientId || '',
        clientName: invoiceToEdit.clientName || '',
        clientService: invoiceToEdit.clientService || '',
        clientAddress: invoiceToEdit.clientAddress || '',
        clientWhatsapp: invoiceToEdit.clientWhatsapp || '',
        clientEmail: invoiceToEdit.clientEmail || '',
        invoiceDate: invoiceToEdit.invoiceDate || today,
        dueDate: invoiceToEdit.dueDate || twoWeeksLater,
        status: invoiceToEdit.status || INVOICE_STATUSES.DRAFT,
        items: invoiceToEdit.items && invoiceToEdit.items.length > 0 
          ? invoiceToEdit.items 
          : [{ id: 'itm_1', description: 'Wedding Photography Service', quantity: 1, rate: 50000, amount: 50000, sortOrder: 0 }],
        discountType: invoiceToEdit.discountType || 'flat',
        discountValue: invoiceToEdit.discountValue || 0,
        enableTax: Boolean(invoiceToEdit.enableTax),
        taxPercent: invoiceToEdit.taxPercent !== undefined ? invoiceToEdit.taxPercent : (settings?.defaultTaxPercent || 18),
        amountPaid: invoiceToEdit.amountPaid || 0,
        paymentMode: invoiceToEdit.paymentMode || '',
        paymentNote: invoiceToEdit.paymentNote || '',
        notes: invoiceToEdit.notes || settings?.defaultTerms || ''
      };
    } else if (invoiceToEdit && !invoiceToEdit.id) {
      // New invoice prefilled with client data
      const defaultRate = Number(invoiceToEdit.rate || (invoiceToEdit.items && invoiceToEdit.items[0]?.rate) || 150000);
      return {
        invoiceNumber: invoiceToEdit.invoiceNumber || nextInvoiceNumber,
        clientId: invoiceToEdit.clientId || '',
        clientName: invoiceToEdit.clientName || '',
        clientService: invoiceToEdit.clientService || '',
        clientAddress: invoiceToEdit.clientAddress || '',
        clientWhatsapp: invoiceToEdit.clientWhatsapp || '',
        clientEmail: invoiceToEdit.clientEmail || '',
        invoiceDate: today,
        dueDate: twoWeeksLater,
        status: INVOICE_STATUSES.SENT,
        items: invoiceToEdit.items && invoiceToEdit.items.length > 0 
          ? invoiceToEdit.items 
          : [{ id: `itm_${Date.now()}`, description: invoiceToEdit.clientService || 'Wedding Photography Service', quantity: 1, rate: defaultRate, amount: defaultRate, sortOrder: 0 }],
        discountType: 'flat',
        discountValue: 0,
        enableTax: settings?.taxEnabledByDefault || false,
        taxPercent: settings?.defaultTaxPercent || 18,
        amountPaid: 0,
        paymentMode: '',
        paymentNote: '',
        notes: settings?.defaultTerms || ''
      };
    } else {
      // Clean new invoice
      const defaultClient = clients.length > 0 ? clients[0] : null;
      return {
        invoiceNumber: nextInvoiceNumber,
        clientId: defaultClient ? defaultClient.id : '',
        clientName: defaultClient ? defaultClient.name : '',
        clientService: defaultClient ? defaultClient.service : '',
        clientAddress: defaultClient ? defaultClient.address : '',
        clientWhatsapp: defaultClient ? defaultClient.whatsappNumber : '',
        clientEmail: defaultClient ? defaultClient.email || '' : '',
        invoiceDate: today,
        dueDate: twoWeeksLater,
        status: INVOICE_STATUSES.SENT,
        items: [
          { 
            id: `itm_${Date.now()}`, 
            description: defaultClient ? defaultClient.service : 'Wedding Photography Service', 
            quantity: 1, 
            rate: defaultClient ? Number(defaultClient.amount) : 150000, 
            amount: defaultClient ? Number(defaultClient.amount) : 150000, 
            sortOrder: 0 
          }
        ],
        discountType: 'flat',
        discountValue: 0,
        enableTax: settings?.taxEnabledByDefault || false,
        taxPercent: settings?.defaultTaxPercent || 18,
        amountPaid: 0,
        paymentMode: '',
        paymentNote: '',
        notes: settings?.defaultTerms || ''
      };
    }
  };

  // ALL React hooks MUST be called unconditionally at the top level
  const [formData, setFormData] = useState(buildInitialState);
  const [statusOverridden, setStatusOverridden] = useState(isEditing);
  const [errors, setErrors] = useState({});

  // Synchronize formData whenever modal opens or invoiceToEdit changes
  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialState());
      setStatusOverridden(isEditing);
      setErrors({});
    }
  }, [isOpen, invoiceToEdit]);

  // NO hooks can be called below this line!
  if (!isOpen) return null;

  // Handle client selection change from dropdown
  const handleClientSelect = (selectedClientId) => {
    const found = clients.find(c => c.id === selectedClientId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        clientId: found.id,
        clientName: found.name,
        clientService: found.service,
        clientAddress: found.address,
        clientWhatsapp: found.whatsappNumber,
        clientEmail: found.email || '',
        items: [
          {
            id: `itm_${Date.now()}`,
            description: found.service,
            quantity: 1,
            rate: Number(found.amount) || 0,
            amount: Number(found.amount) || 0,
            sortOrder: 0
          }
        ]
      }));
    }
  };

  // Calculations
  const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  let discount = 0;
  if (formData.discountType === 'percent') {
    discount = (subtotal * (Number(formData.discountValue) || 0)) / 100;
  } else {
    discount = Number(formData.discountValue) || 0;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = formData.enableTax ? (taxableAmount * (Number(formData.taxPercent) || 0)) / 100 : 0;
  const grandTotal = taxableAmount + taxAmount;

  const amountPaidNum = Number(formData.amountPaid) || 0;
  const balanceDue = Math.max(0, grandTotal - amountPaidNum);

  // Derive status inline without useMemo to comply strictly with Rule of Hooks
  const getDerivedStatus = () => {
    if (statusOverridden) return formData.status;
    if (amountPaidNum >= grandTotal && grandTotal > 0) {
      return INVOICE_STATUSES.PAID;
    }
    if (amountPaidNum > 0 && amountPaidNum < grandTotal) {
      return INVOICE_STATUSES.PARTIALLY_PAID;
    }
    
    const due = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today && balanceDue > 0) {
      return INVOICE_STATUSES.OVERDUE;
    }

    return formData.status || INVOICE_STATUSES.SENT;
  };

  const derivedStatus = getDerivedStatus();

  // Line item handlers
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const item = { ...updatedItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) : Number(item.quantity);
      const r = field === 'rate' ? Number(value) : Number(item.rate);
      item.amount = q * r;
    }

    updatedItems[index] = item;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `itm_${Date.now()}_${prev.items.length}`,
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
          sortOrder: prev.items.length
        }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updated }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.invoiceNumber.trim()) errs.invoiceNumber = 'Invoice number is required';
    if (!formData.clientName.trim()) errs.clientName = 'Client name is required';
    if (!formData.clientWhatsapp.trim()) errs.clientWhatsapp = 'WhatsApp number is required';
    if (formData.items.length === 0) errs.items = 'At least one line item is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalStatus = derivedStatus;

    if (finalStatus === INVOICE_STATUSES.PAID && invoiceToEdit?.status !== INVOICE_STATUSES.PAID) {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    }

    onSave({
      ...formData,
      subtotal,
      discount,
      taxAmount,
      grandTotal,
      balanceDue,
      status: finalStatus
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-tsw-ink/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full border border-tsw-border shadow-tsw-modal overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-tsw-border bg-tsw-bg">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-tsw-ink">
              {isEditing 
                ? `Edit Invoice #${invoiceToEdit.invoiceNumber}` 
                : formData.clientName 
                  ? `Create Invoice for ${formData.clientName}`
                  : 'Create New Invoice'}
            </h2>
            {isEditing && invoiceToEdit?.lastEditedAt && (
              <p className="text-[10px] sm:text-[11px] text-tsw-muted">
                Last edited on: {new Date(invoiceToEdit.lastEditedAt).toLocaleString('en-IN')}
              </p>
            )}
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          
          {/* Top Section: Invoice Number & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-tsw-bg p-4 rounded-2xl border border-tsw-border">
            
            {/* Invoice Number */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-tsw-gold-dark mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm font-mono font-bold text-tsw-ink bg-white focus:border-tsw-gold focus:outline-none"
              />
              {errors.invoiceNumber && <p className="text-xs text-tsw-brick mt-0.5">{errors.invoiceNumber}</p>}
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-tsw-gold-dark mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm text-tsw-ink bg-white focus:border-tsw-gold focus:outline-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-tsw-gold-dark mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm text-tsw-ink bg-white focus:border-tsw-gold focus:outline-none"
              />
            </div>

          </div>

          {/* Client Selection & Billing Details */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-tsw-ink">
                Client Billing Information
              </label>
              <button
                type="button"
                onClick={onAddNewClientInline}
                className="text-xs font-semibold text-tsw-gold hover:text-tsw-gold-dark flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Client</span>
              </button>
            </div>

            {/* Client Selector Dropdown */}
            {clients.length > 0 && (
              <select
                value={formData.clientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-tsw-border text-xs sm:text-sm bg-white focus:border-tsw-gold focus:outline-none font-medium text-tsw-ink"
              >
                <option value="">-- Select Master Client Record --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.service} - {c.whatsappNumber})
                  </option>
                ))}
              </select>
            )}

            {/* Editable Per-Invoice Billing Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Billed Name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Client full name"
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.clientWhatsapp}
                  onChange={(e) => setFormData({ ...formData, clientWhatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Billing Address</label>
                <input
                  type="text"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                  placeholder="Address for invoice letterhead"
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-xs sm:text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-tsw-ink">
                Service Line Items
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg bg-tsw-gold-light text-tsw-gold-dark hover:bg-tsw-gold hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Service Row</span>
              </button>
            </div>

            <div className="border border-tsw-border rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-tsw-bg text-tsw-ink uppercase text-[10px] font-bold tracking-wider border-b border-tsw-border">
                  <tr>
                    <th className="py-3 px-4">Service Description</th>
                    <th className="py-3 px-4 w-20 text-center">Qty</th>
                    <th className="py-3 px-4 w-32 text-right">Rate (₹)</th>
                    <th className="py-3 px-4 w-32 text-right">Amount (₹)</th>
                    <th className="py-3 px-3 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tsw-border">
                  {formData.items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-tsw-subtle/30">
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="e.g. Wedding Photography & Candid Coverage"
                          className="w-full px-3 py-1.5 rounded-lg border border-tsw-border text-xs focus:border-tsw-gold focus:outline-none"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-tsw-border text-xs text-center font-mono focus:border-tsw-gold focus:outline-none"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-tsw-border text-xs text-right font-mono focus:border-tsw-gold focus:outline-none"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-right text-tsw-ink">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={formData.items.length === 1}
                          className="p-1 text-tsw-muted hover:text-tsw-brick disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtotal, Discounts, GST & Payments Calculation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Left: Notes & Terms */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-tsw-ink mb-1">
                  Terms & Payment Notes
                </label>
                <textarea
                  rows="4"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Studio payment terms and conditions..."
                  className="w-full p-3 rounded-xl border border-tsw-border text-xs text-tsw-ink focus:border-tsw-gold focus:outline-none"
                ></textarea>
              </div>

              {/* Payment Remark */}
              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">
                  Payment Mode & Reference Note
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-tsw-border text-xs bg-white focus:border-tsw-gold"
                  >
                    <option value="">Select Mode...</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Cheque / Other</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Ref # or note..."
                    value={formData.paymentNote}
                    onChange={(e) => setFormData({ ...formData, paymentNote: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-tsw-border text-xs focus:border-tsw-gold"
                  />
                </div>
              </div>
            </div>

            {/* Right: Financial Totals Breakdown & Payment Tracking */}
            <div className="bg-tsw-bg p-4 sm:p-5 rounded-2xl border border-tsw-border space-y-3">
              
              {/* Subtotal */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-tsw-muted">Subtotal:</span>
                <span className="font-mono font-bold text-tsw-ink">{formatCurrency(subtotal)}</span>
              </div>

              {/* Discount Row */}
              <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-tsw-border">
                <span className="text-tsw-muted">Discount:</span>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="px-2 py-1 rounded-lg border border-tsw-border text-xs bg-white"
                  >
                    <option value="flat">₹ Flat</option>
                    <option value="percent">% Percent</option>
                  </select>

                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-24 px-2 py-1 rounded-lg border border-tsw-border text-xs text-right font-mono"
                  />
                </div>
              </div>

              {/* Tax / GST Toggle */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-tsw-border">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableTax}
                    onChange={(e) => setFormData({ ...formData, enableTax: e.target.checked })}
                    className="rounded text-tsw-gold focus:ring-tsw-gold h-4 w-4"
                  />
                  <span className="text-tsw-ink font-semibold">Add GST / Tax ({formData.taxPercent}%)</span>
                </label>
                <span className="font-mono text-tsw-ink">{formatCurrency(taxAmount)}</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center py-2.5 border-y-2 border-tsw-ink text-sm font-bold text-tsw-ink">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-tsw-gold font-serif">{formatCurrency(grandTotal)}</span>
              </div>

              {/* Payment Tracking: Amount Paid */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-tsw-sage-dark">Amount Paid So Far (₹):</label>
                  <input
                    type="number"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                    className="w-32 px-3 py-1.5 rounded-xl border border-tsw-sage text-xs text-right font-mono font-bold text-tsw-sage-dark bg-white focus:outline-none focus:ring-1 focus:ring-tsw-sage"
                  />
                </div>
              </div>

              {/* Balance Due */}
              <div className="flex justify-between items-center text-xs font-bold text-tsw-terracotta pt-1 border-t border-tsw-border">
                <span>Balance Due:</span>
                <span className="font-mono text-sm">{formatCurrency(balanceDue)}</span>
              </div>

              {/* Derived Status & Status Override */}
              <div className="pt-2 border-t border-tsw-border flex items-center justify-between text-xs">
                <span className="text-tsw-muted">Derived Status:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-tsw-ink bg-white px-2.5 py-1 rounded-lg border border-tsw-border">
                    {derivedStatus}
                  </span>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      setStatusOverridden(true);
                      setFormData({ ...formData, status: e.target.value });
                    }}
                    className="px-2 py-1 rounded-lg border border-tsw-border text-xs bg-white"
                  >
                    {Object.values(INVOICE_STATUSES).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-tsw-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-tsw-border text-tsw-ink text-sm font-medium hover:bg-tsw-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-tsw-gold text-white text-sm font-semibold hover:bg-tsw-gold-hover transition-all flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Generate Invoice'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
