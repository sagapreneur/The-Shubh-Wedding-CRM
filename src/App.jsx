import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/Dashboard/DashboardView';
import ClientList from './components/Clients/ClientList';
import ClientFormModal from './components/Clients/ClientFormModal';
import ClientDetailModal from './components/Clients/ClientDetailModal';
import InvoiceList from './components/Invoices/InvoiceList';
import InvoiceForm from './components/Invoices/InvoiceForm';
import InvoicePreviewModal from './components/Invoices/InvoicePreviewModal';
import ReportsView from './components/Reports/ReportsView';
import SettingsModal from './components/Settings/SettingsModal';
import { storageService } from './services/storageService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Application Data States
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState(null);

  // Modal Control States
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  const [isClientDetailOpen, setIsClientDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);

  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load Data on Mount
  const loadAllData = () => {
    const cData = storageService.getClients();
    const iData = storageService.getInvoices();
    const sData = storageService.getSettings();
    setClients(cData);
    setInvoices(iData);
    setSettings(sData);

    // Keep selected client updated if detail modal is active
    if (selectedClient) {
      const freshClient = cData.find(c => c.id === selectedClient.id);
      if (freshClient) setSelectedClient(freshClient);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Tab Navigation vs Settings Modal
  const handleTabChange = (tabId) => {
    if (tabId === 'settings') {
      setIsSettingsOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  // CLIENT HANDLERS
  const handleOpenAddClient = () => {
    setClientToEdit(null);
    setIsClientFormOpen(true);
  };

  const handleOpenEditClient = (client) => {
    setClientToEdit(client);
    setIsClientFormOpen(true);
  };

  const handleSaveClient = (clientData) => {
    let savedClient;
    if (clientData.id) {
      savedClient = storageService.updateClient(clientData);
    } else {
      savedClient = storageService.addClient(clientData);
    }
    loadAllData();
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setIsClientDetailOpen(true);
  };

  // INVOICE HANDLERS
  const handleOpenNewInvoice = () => {
    setInvoiceToEdit(null);
    setIsInvoiceFormOpen(true);
  };

  const handleOpenNewInvoiceForClient = (client) => {
    setInvoiceToEdit({
      clientId: client.id,
      clientName: client.name,
      clientService: client.service,
      clientAddress: client.address,
      clientWhatsapp: client.whatsappNumber,
      clientEmail: client.email || '',
      items: [
        {
          id: `itm_${Date.now()}`,
          description: client.service,
          quantity: 1,
          rate: client.amount,
          amount: client.amount,
          sortOrder: 0
        }
      ]
    });
    setIsInvoiceFormOpen(true);
  };

  const handleOpenEditInvoice = (invoice) => {
    setInvoiceToEdit(invoice);
    setIsInvoiceFormOpen(true);
  };

  const handleSaveInvoice = (invoiceData) => {
    let savedInvoice;
    if (invoiceData.id) {
      savedInvoice = storageService.updateInvoice(invoiceData);
    } else {
      savedInvoice = storageService.addInvoice(invoiceData);
    }
    loadAllData();

    // Automatically open the print-ready A4 PDF preview modal for instant view, print, or WhatsApp sharing!
    if (savedInvoice) {
      setSelectedInvoice(savedInvoice);
      setIsInvoicePreviewOpen(true);
    }
  };

  const handleDuplicateInvoice = (invoice) => {
    const nextNo = storageService.getNextInvoiceNumber();
    const cloned = {
      ...invoice,
      id: undefined,
      invoiceNumber: nextNo,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      amountPaid: 0,
      status: 'Sent',
      balanceDue: invoice.grandTotal
    };
    setInvoiceToEdit(cloned);
    setIsInvoiceFormOpen(true);
  };

  const handleDeleteInvoice = (invoiceId) => {
    storageService.deleteInvoice(invoiceId);
    loadAllData();
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoicePreviewOpen(true);
  };

  // SETTINGS HANDLERS
  const handleSaveSettings = (newSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetData = () => {
    if (window.confirm('Reset app data back to factory demo state (sample clients & invoices)?')) {
      storageService.resetToDefaults();
      loadAllData();
    }
  };

  const nextInvoiceNumber = storageService.getNextInvoiceNumber();
  const selectedClientInvoices = selectedClient 
    ? invoices.filter(inv => inv.clientId === selectedClient.id) 
    : [];

  return (
    <div className="min-h-screen bg-tsw-bg flex flex-col font-sans selection:bg-tsw-gold-light selection:text-tsw-gold-dark">
      
      {/* Top App Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onNewInvoice={() => handleOpenNewInvoice()}
        onNewClient={handleOpenAddClient}
        onResetData={handleResetData}
      />

      {/* Main Module View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            clients={clients}
            invoices={invoices}
            settings={settings}
            onViewInvoice={handleViewInvoice}
            onNewInvoice={() => handleOpenNewInvoice()}
            onSelectClient={handleSelectClient}
          />
        )}

        {activeTab === 'clients' && (
          <ClientList
            clients={clients}
            invoices={invoices}
            onAddClient={handleOpenAddClient}
            onEditClient={handleOpenEditClient}
            onSelectClient={handleSelectClient}
            onNewInvoiceForClient={handleOpenNewInvoiceForClient}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceList
            invoices={invoices}
            settings={settings}
            onNewInvoice={() => handleOpenNewInvoice()}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleOpenEditInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            clients={clients}
            invoices={invoices}
          />
        )}

      </main>

      {/* MODALS */}
      {/* 1. Client Add/Edit Modal */}
      <ClientFormModal
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />

      {/* 2. Client Profile & Invoices Detail Modal */}
      <ClientDetailModal
        isOpen={isClientDetailOpen}
        onClose={() => setIsClientDetailOpen(false)}
        client={selectedClient}
        clientInvoices={selectedClientInvoices}
        onEditClient={handleOpenEditClient}
        onNewInvoiceForClient={handleOpenNewInvoiceForClient}
        onViewInvoice={handleViewInvoice}
      />

      {/* 3. Invoice Create/Edit Modal */}
      <InvoiceForm
        isOpen={isInvoiceFormOpen}
        onClose={() => setIsInvoiceFormOpen(false)}
        onSave={handleSaveInvoice}
        invoiceToEdit={invoiceToEdit}
        clients={clients}
        settings={settings}
        onAddNewClientInline={handleOpenAddClient}
        nextInvoiceNumber={nextInvoiceNumber}
      />

      {/* 4. A4 Print & PDF Preview Modal */}
      <InvoicePreviewModal
        isOpen={isInvoicePreviewOpen}
        onClose={() => setIsInvoicePreviewOpen(false)}
        invoice={selectedInvoice}
        settings={settings}
        onEditInvoice={handleOpenEditInvoice}
      />

      {/* 5. Studio Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetDefaults={handleResetData}
      />

    </div>
  );
}
