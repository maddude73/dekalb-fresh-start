
'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ... (interfaces and other code remain the same)

interface Analysis {
  marketValue: number;
  mortgageBalance: number;
  equity: number;
  profitPotential: number;
  dealScore: number;
}

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  freshStartAmount: number;
  status: string;
  createdAt: string;
  analysis?: Analysis;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        {children}
      </div>
    </div>
  );
};

interface LeadTableProps {
  leads: Lead[];
  handleLeadSelect: (lead: Lead) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  handleSave: (lead: Lead) => Promise<void>;
  handleDelete: (leadId: string) => Promise<void>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  requestSort: (key: keyof Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, handleLeadSelect, openMenuId, setOpenMenuId, handleSave, handleDelete, menuRef, requestSort }) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort('name')}>Name</th>
          <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort('address')}>Address</th>
          <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort('status')}>Status</th>
          <th className="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {leads.map((lead, index) => (
          <tr
            key={lead._id}
            className="border-b border-gray-200 hover:bg-yellow-100 cursor-pointer"
            onClick={() => handleLeadSelect(lead)}
          >
            <td className="py-3 px-6 text-left whitespace-nowrap">{lead.name}</td>
            <td className="py-3 px-6 text-left">{lead.address}</td>
            <td className="py-3 px-6 text-center">
              <span className={`py-1 px-3 rounded-full text-xs ${lead.status === 'New' ? 'bg-blue-200 text-blue-600' : 'bg-green-200 text-green-600'}`}>
                {lead.status}
              </span>
            </td>
            <td className="py-3 px-6 text-center">
              <div className="relative" ref={menuRef}>
                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === lead._id ? null : lead._id)}} className="focus:outline-none">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
                {openMenuId === lead._id && (
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${leads.length - index <= 2 ? 'bottom-full' : ''}`}>
                    <a href="#" onClick={(e) => {e.stopPropagation(); handleSave(lead)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Save</a>
                    <a href="#" onClick={(e) => {e.stopPropagation(); handleDelete(lead._id)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</a>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface LeadCardsProps {
  leads: Lead[];
  handleLeadSelect: (lead: Lead) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  handleSave: (lead: Lead) => Promise<void>;
  handleDelete: (leadId: string) => Promise<void>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  formatAddress: (lead: Lead) => string;
}

const LeadCards: React.FC<LeadCardsProps> = ({ leads, handleLeadSelect, openMenuId, setOpenMenuId, handleSave, handleDelete, menuRef, formatAddress }) => (
  <div className="md:hidden">
    {leads.map((lead, index) => (
      <div key={lead._id} className="bg-white rounded-lg shadow-lg p-4 mb-4" onClick={() => handleLeadSelect(lead)}>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg text-gray-800">{lead.name}</p>
            <p className="text-sm text-gray-600">{formatAddress(lead)}</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === lead._id ? null : lead._id)}} className="focus:outline-none">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            {openMenuId === lead._id && (
              <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${leads.length - index <= 2 ? 'bottom-full' : ''}`}>
                <a href="#" onClick={(e) => {e.stopPropagation(); handleSave(lead)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Save</a>
                <a href="#" onClick={(e) => {e.stopPropagation(); handleDelete(lead._id)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</a>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <span className={`py-1 px-3 rounded-full text-xs ${lead.status === 'New' ? 'bg-blue-200 text-blue-600' : 'bg-green-200 text-green-600'}`}>
            {lead.status}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'ascending' | 'descending' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchLeads = async () => {
    const response = await fetch('/api/leads');
    if (response.ok) {
      const data = await response.json();
      setLeads(data);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const sortedAndFilteredLeads = useMemo(() => {
    const filteredLeads = leads.filter(lead =>
      lead.name.toLowerCase().includes(filter.toLowerCase()) ||
      lead.address.toLowerCase().includes(filter.toLowerCase())
    );

    if (sortConfig !== null) {
      filteredLeads.sort((a, b) => {
        const aValue = String(a[sortConfig.key] || '');
        const bValue = String(b[sortConfig.key] || '');

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredLeads;
  }, [leads, filter, sortConfig]);

  const requestSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
    if (lead.analysis) {
      setAnalysis(lead.analysis);
      setAnalyzing(false);
    } else {
      setAnalysis(null);
      setAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        const marketValue = Math.floor(Math.random() * (450000 - 350000 + 1)) + 350000;
        const mortgageBalance = (marketValue * 0.7) - lead.freshStartAmount;
        const equity = marketValue - mortgageBalance;
        const profitPotential = equity - lead.freshStartAmount - (marketValue * 0.1);
        const dealScore = Math.floor(Math.random() * (95 - 80 + 1)) + 80;

        const newAnalysis = {
          marketValue,
          mortgageBalance,
          equity,
          profitPotential,
          dealScore,
        };
        setAnalysis(newAnalysis);
        setAnalyzing(false);
      }, Math.random() * (3000 - 500) + 500);
    }
  };

  const formatAddress = (lead: Lead) => {
    return `${lead.address}, ${lead.city}, ${lead.state} ${lead.zip}`;
  }

  const handleDelete = async (leadId: string) => {
    const response = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
    if (response.ok) {
      setLeads(leads.filter(lead => lead._id !== leadId));
    }
    setOpenMenuId(null);
  };

  const handleSave = async (lead: Lead) => {
    if (!analysis) return;
    const response = await fetch(`/api/leads/${lead._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Saved', analysis }),
    });

    if (response.ok) {
      fetchLeads(); // Refetch leads to update the list
    }
    setOpenMenuId(null);
  };

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Leads</h2>
            <input
              type="text"
              placeholder="Filter by name or address..."
              className="p-2 border border-gray-300 rounded-md text-gray-800"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <LeadTable leads={sortedAndFilteredLeads} handleLeadSelect={handleLeadSelect} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} handleSave={handleSave} handleDelete={handleDelete} menuRef={menuRef} requestSort={requestSort} />
          <LeadCards leads={sortedAndFilteredLeads} handleLeadSelect={handleLeadSelect} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} handleSave={handleSave} handleDelete={handleDelete} menuRef={menuRef} formatAddress={formatAddress} />
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedLead && (
            <div>
              <div className="mb-4">
                <h3 className="font-bold text-gray-800">{selectedLead.name}</h3>
                <p className="text-gray-700">{formatAddress(selectedLead)}</p>
              </div>
              {analyzing && (
                <div className="flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <p>Connecting to DeKalb County Records...</p>
                    <p>Fetching Market Comps...</p>
                    <p>Analyzing Mortgage & Liens...</p>
                    <p>Vetting Complete!</p>
                  </div>
                </div>
              )}
              {analysis && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Market Value</p>
                      <p className="font-bold text-lg text-gray-800">${analysis.marketValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Mortgage Balance</p>
                      <p className="font-bold text-lg text-gray-800">${analysis.mortgageBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Equity</p>
                      <p className="font-bold text-lg text-gray-800">${analysis.equity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CS3 Profit Potential</p>
                      <p className="font-bold text-lg text-gray-800">${analysis.profitPotential.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-100">
                    <p className="text-sm text-gray-500">Recommendation</p>
                    <p className="font-bold text-2xl text-green-600">GO - HIGH PROFIT POTENTIAL</p>
                    <p className="text-sm text-gray-500 mt-2">Deal Score</p>
                    <p className="font-bold text-xl">{analysis.dealScore}/100</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
