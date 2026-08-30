import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Plus, 
  RotateCcw,
  UserPlus
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onNewInvoice, 
  onNewClient, 
  onResetData 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <header className="bg-white border-b border-tsw-border sticky top-0 z-30 shadow-tsw-card no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center space-x-3 group focus:outline-none"
            >
              <img 
                src="/Logo-01.png" 
                alt="The Shubh Wedding Logo" 
                className="h-8 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block text-left border-l border-tsw-border pl-3">
                <span className="block text-[10px] sm:text-xs font-semibold tracking-widest text-tsw-gold uppercase">
                  Studio CRM
                </span>
                <span className="block font-serif text-xs sm:text-sm font-semibold text-tsw-ink leading-tight">
                  Invoicing & Payments
                </span>
              </div>
            </button>

            {/* Navigation Tabs (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1 pl-6 border-l border-tsw-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-tsw-gold-light text-tsw-gold-dark font-semibold shadow-sm'
                        : 'text-tsw-ink/70 hover:text-tsw-ink hover:bg-tsw-subtle'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-tsw-gold-dark' : 'text-tsw-muted'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setActiveTab('settings')}
              title="Studio Settings"
              className={`p-2 sm:p-2.5 rounded-xl border border-tsw-border transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-tsw-gold-light text-tsw-gold-dark border-tsw-gold/30' 
                  : 'text-tsw-ink/70 hover:text-tsw-ink hover:bg-tsw-subtle'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onResetData}
              title="Reset Sample Data"
              className="p-2 sm:p-2.5 rounded-xl border border-tsw-border text-tsw-muted hover:text-tsw-brick hover:border-tsw-brick/30 hover:bg-tsw-brick-light transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Add Client Button: Fixed alignment & single line whitespace-nowrap */}
            <button
              onClick={onNewClient}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-tsw-border text-tsw-ink text-xs sm:text-sm font-semibold hover:bg-tsw-subtle transition-all whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-4 h-4 text-tsw-gold shrink-0" />
              <span>+ Add Client</span>
            </button>

            {/* New Invoice Button */}
            <button
              onClick={onNewInvoice}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-tsw-gold text-white text-xs sm:text-sm font-semibold hover:bg-tsw-gold-hover transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>New Invoice</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row (Smooth Horizontal Scroll) */}
        <div className="lg:hidden flex items-center space-x-1 pb-2.5 overflow-x-auto border-t border-tsw-border pt-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-tsw-gold-light text-tsw-gold-dark font-bold shadow-sm'
                    : 'text-tsw-ink/70 hover:bg-tsw-subtle'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-tsw-gold-dark' : 'text-tsw-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
