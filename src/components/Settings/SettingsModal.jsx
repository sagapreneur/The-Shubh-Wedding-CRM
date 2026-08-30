import React, { useState } from 'react';
import { X, Check, Save, RotateCcw } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings, onResetDefaults }) {
  const [formData, setFormData] = useState({
    studioName: settings?.studioName || 'The Shubh Wedding',
    tagline: settings?.tagline || 'Luxury Wedding & Portrait Photography',
    address: settings?.address || 'Defence Colony, New Delhi 110024',
    phone: settings?.phone || '+91 98100 87654',
    email: settings?.email || 'inquiries@theshubhwedding.com',
    gstin: settings?.gstin || '',
    defaultTerms: settings?.defaultTerms || '1. 50% advance required upon booking.\n2. Balance 50% payable on delivery.',
    defaultTaxPercent: settings?.defaultTaxPercent || 18,
    taxEnabledByDefault: Boolean(settings?.taxEnabledByDefault),
    reminderTemplate: settings?.reminderTemplate || 'Hi {Client Name}, this is a gentle reminder that {Balance Due} is pending for Invoice #{Invoice No.} ({Service}) with The Shubh Wedding. Kindly complete the payment at your convenience. Thank you! 🙏'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tsw-ink/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-tsw-border shadow-tsw-modal overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tsw-border bg-tsw-bg">
          <h2 className="text-xl font-serif font-bold text-tsw-ink">
            Studio Settings & Letterhead Configuration
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-tsw-muted hover:text-tsw-ink hover:bg-tsw-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-tsw-gold-dark border-b border-tsw-border pb-1">
              1. Studio Letterhead Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Studio Name</label>
                <input
                  type="text"
                  value={formData.studioName}
                  onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Studio Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Studio Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">GSTIN (Optional)</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tax & Terms Defaults */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-tsw-gold-dark border-b border-tsw-border pb-1">
              2. Invoice & Tax Defaults
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Default GST / Tax Rate (%)</label>
                <input
                  type="number"
                  value={formData.defaultTaxPercent}
                  onChange={(e) => setFormData({ ...formData, defaultTaxPercent: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-tsw-border text-sm focus:border-tsw-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-tsw-ink">
                  <input
                    type="checkbox"
                    checked={formData.taxEnabledByDefault}
                    onChange={(e) => setFormData({ ...formData, taxEnabledByDefault: e.target.checked })}
                    className="rounded text-tsw-gold focus:ring-tsw-gold"
                  />
                  <span>Enable Tax by default on new invoices</span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-tsw-muted mb-1">Default Terms & Conditions</label>
                <textarea
                  rows="3"
                  value={formData.defaultTerms}
                  onChange={(e) => setFormData({ ...formData, defaultTerms: e.target.value })}
                  className="w-full p-3 rounded-xl border border-tsw-border text-xs focus:border-tsw-gold focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* WhatsApp Message Template */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-tsw-gold-dark border-b border-tsw-border pb-1">
              3. WhatsApp Payment Reminder Template
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-tsw-muted mb-1">
                Reminder Message Template (supports placeholders: &#123;Client Name&#125;, &#123;Balance Due&#125;, &#123;Invoice No.&#125;, &#123;Service&#125;)
              </label>
              <textarea
                rows="3"
                value={formData.reminderTemplate}
                onChange={(e) => setFormData({ ...formData, reminderTemplate: e.target.value })}
                className="w-full p-3 rounded-xl border border-tsw-border text-xs focus:border-tsw-gold focus:outline-none"
              ></textarea>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-tsw-border">
            <button
              type="button"
              onClick={onResetDefaults}
              className="text-xs font-semibold text-tsw-brick hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Factory Sample Data</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl border border-tsw-border text-tsw-ink text-xs font-semibold hover:bg-tsw-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-tsw-gold text-white text-xs font-semibold hover:bg-tsw-gold-hover transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
