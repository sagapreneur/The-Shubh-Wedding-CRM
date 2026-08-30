import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, IndianRupee, FileText, Check } from 'lucide-react';
import { COMMON_SERVICES } from '../../types';

export default function ClientFormModal({ isOpen, onClose, onSave, clientToEdit = null }) {
  const [formData, setFormData] = useState({
    name: '',
    service: COMMON_SERVICES[0],
    customService: '',
    amount: '',
    address: '',
    whatsappNumber: '',
    email: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (clientToEdit) {
      const isCustom = !COMMON_SERVICES.includes(clientToEdit.service);
      setFormData({
        name: clientToEdit.name || '',
        service: isCustom ? 'Custom' : clientToEdit.service,
        customService: isCustom ? clientToEdit.service : '',
        amount: clientToEdit.amount || '',
        address: clientToEdit.address || '',
        whatsappNumber: clientToEdit.whatsappNumber || '',
        email: clientToEdit.email || '',
        notes: clientToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        service: COMMON_SERVICES[0],
        customService: '',
        amount: '',
        address: '',
        whatsappNumber: '+91 ',
        email: '',
        notes: ''
      });
    }
    setErrors({});
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Client Name is required';
    
    const finalService = formData.service === 'Custom' ? formData.customService : formData.service;
    if (!finalService.trim()) errs.service = 'Service description is required';
    
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = 'Valid package amount is required';
    if (!formData.address.trim()) errs.address = 'Billing address is required';
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.length < 8) errs.whatsappNumber = 'Valid WhatsApp number is required';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalService = formData.service === 'Custom' ? formData.customService : formData.service;

    onSave({
      ...(clientToEdit ? { id: clientToEdit.id } : {}),
      name: formData.name.trim(),
      service: finalService.trim(),
      amount: Number(formData.amount),
      address: formData.address.trim(),
      whatsappNumber: formData.whatsappNumber.trim(),
      email: formData.email.trim(),
      notes: formData.notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tsw-ink/50 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-tsw-border shadow-tsw-modal overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tsw-border bg-tsw-bg">
          <h2 className="text-xl font-serif font-bold text-tsw-ink">
            {clientToEdit ? 'Edit Client Record' : 'Add New Studio Client'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-ink mb-1.5">
              Client Full Name <span className="text-tsw-brick">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Rahul & Ananya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.name ? 'border-tsw-brick bg-tsw-brick-light/30' : 'border-tsw-border focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-tsw-brick mt-1">{errors.name}</p>}
          </div>

          {/* Service & Custom Option */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-ink mb-1.5">
              Primary Photography Service <span className="text-tsw-brick">*</span>
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-tsw-border text-sm focus:outline-none focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold bg-white"
            >
              {COMMON_SERVICES.map((srv) => (
                <option key={srv} value={srv}>{srv}</option>
              ))}
              <option value="Custom">+ Custom Service Description...</option>
            </select>

            {formData.service === 'Custom' && (
              <input
                type="text"
                placeholder="Type custom service name..."
                value={formData.customService}
                onChange={(e) => setFormData({ ...formData, customService: e.target.value })}
                className="w-full mt-2 px-4 py-2.5 rounded-xl border border-tsw-border text-sm focus:outline-none focus:border-tsw-gold"
              />
            )}
            {errors.service && <p className="text-xs text-tsw-brick mt-1">{errors.service}</p>}
          </div>

          {/* Package Amount & WhatsApp Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Agreed Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-ink mb-1.5">
                Agreed Package Amount (₹) <span className="text-tsw-brick">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
                <input
                  type="number"
                  placeholder="250000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.amount ? 'border-tsw-brick bg-tsw-brick-light/30' : 'border-tsw-border focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-tsw-brick mt-1">{errors.amount}</p>}
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-ink mb-1.5">
                WhatsApp Number <span className="text-tsw-brick">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.whatsappNumber ? 'border-tsw-brick bg-tsw-brick-light/30' : 'border-tsw-border focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold'
                  }`}
                />
              </div>
              {errors.whatsappNumber && <p className="text-xs text-tsw-brick mt-1">{errors.whatsappNumber}</p>}
            </div>

          </div>

          {/* Billing Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-ink mb-1.5">
              Billing Address <span className="text-tsw-brick">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Full address for invoice billing"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.address ? 'border-tsw-brick bg-tsw-brick-light/30' : 'border-tsw-border focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold'
                }`}
              />
            </div>
            {errors.address && <p className="text-xs text-tsw-brick mt-1">{errors.address}</p>}
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-muted mb-1.5">
              Email Address <span className="text-tsw-muted/60">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-tsw-border text-sm focus:outline-none focus:border-tsw-gold"
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-muted mb-1.5">
              Internal Studio Notes <span className="text-tsw-muted/60">(Optional)</span>
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Venue details, special shoot instructions, team size..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-tsw-border text-sm focus:outline-none focus:border-tsw-gold"
            ></textarea>
          </div>

          {/* Footer Actions */}
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
              <span>{clientToEdit ? 'Save Changes' : 'Save Client'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
