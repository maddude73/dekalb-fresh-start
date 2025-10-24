
'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';

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
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
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
        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort('name')}>Name</th>
          <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort('address')}>Address</th>
          <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort('status')}>Status</th>
          <th className="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
        {leads.map((lead, index) => (
          <tr
            key={lead._id}
            className="border-b border-gray-200 dark:border-gray-700 hover:bg-yellow-100 dark:hover:bg-yellow-900 cursor-pointer"
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
                  <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
                {openMenuId === lead._id && (
                  <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 ${leads.length - index <= 2 ? 'bottom-full' : ''}`}>
                    <a href="#" onClick={(e) => {e.stopPropagation(); handleSave(lead)}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-300 dark:hover:bg-yellow-700">Save</a>
                    <a href="#" onClick={(e) => {e.stopPropagation(); handleDelete(lead._id)}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-300 dark:hover:bg-yellow-700">Delete</a>
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
      <div key={lead._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4" onClick={() => handleLeadSelect(lead)}>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg text-gray-800 dark:text-white">{lead.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatAddress(lead)}</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === lead._id ? null : lead._id)}} className="focus:outline-none">
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            {openMenuId === lead._id && (
              <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 ${leads.length - index <= 2 ? 'bottom-full' : ''}`}>
                <a href="#" onClick={(e) => {e.stopPropagation(); handleSave(lead)}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-300 dark:hover:bg-yellow-700">Save</a>
                <a href="#" onClick={(e) => {e.stopPropagation(); handleDelete(lead._id)}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-300 dark:hover:bg-yellow-700">Delete</a>
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

interface DesktopAnalysisDisplayProps {
  selectedLead: Lead | null;
  analysis: Analysis | null;
  analyzing: boolean;
  formatAddress: (lead: Lead) => string;
}

const DesktopAnalysisDisplay: React.FC<DesktopAnalysisDisplayProps> = ({ selectedLead, analysis, analyzing, formatAddress }) => {
  if (!selectedLead) {
    return (
      <div className="hidden md:block w-1/2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ml-4">
        <p className="text-gray-500 dark:text-gray-400 text-center">Select a lead to view analysis</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block w-1/2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ml-4">
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 dark:text-white">{selectedLead.name}</h3>
        <p className="text-gray-700 dark:text-gray-300">{formatAddress(selectedLead)}</p>
      </div>
      {analyzing && (
        <div className="flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <p className="dark:text-white">Connecting to DeKalb County Records...</p>
            <p className="dark:text-white">Fetching Market Comps...</p>
            <p className="dark:text-white">Analyzing Mortgage & Liens...</p>
            <p className="dark:text-white">Vetting Complete!</p>
          </div>
        </div>
      )}
      {analysis && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Market Value</p>
              <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.marketValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Mortgage Balance</p>
              <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.mortgageBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Equity</p>
              <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.equity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Profit Potential</p>
              <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.profitPotential.toLocaleString()}</p>
            </div>
          </div>
          {(() => {
            let recommendationText = "";
            let bgColorClass = "";
            let textColorClass = "";

            if (analysis.profitPotential < 0) {
              recommendationText = "UNPROFITABLE";
              bgColorClass = "bg-red-100 dark:bg-red-900";
              textColorClass = "text-red-600 dark:text-red-300";
            } else if (analysis.dealScore < 85) {
              recommendationText = "BORDERLINE - LOW DEAL SCORE";
              bgColorClass = "bg-orange-100 dark:bg-orange-900";
              textColorClass = "text-orange-600 dark:text-orange-300";
            } else {
              recommendationText = "GO - HIGH PROFIT POTENTIAL";
              bgColorClass = "bg-green-100 dark:bg-green-900";
              textColorClass = "text-green-600 dark:text-green-300";
            }

            return (
              <div className={`text-center p-4 rounded-lg ${bgColorClass}`}>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recommendation</p>
                <p className={`font-bold text-2xl ${textColorClass}`}>{recommendationText}</p>
                <p className="font-bold text-xl text-black dark:text-white">{analysis.dealScore}/100</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

interface ReportingCardProps {
  leads: Lead[];
  reportingFilter: string;
  setReportingFilter: (filter: string) => void;
  reportingSortConfig: { key: keyof Lead; direction: 'ascending' | 'descending' } | null;
  requestReportingSort: (key: keyof Lead) => void;
  formatAddress: (lead: Lead) => string;
}

const ReportingCard: React.FC<ReportingCardProps> = ({ leads, reportingFilter, setReportingFilter, reportingSortConfig, requestReportingSort, formatAddress }) => {
  const getRowClass = (lead: Lead) => {
    if (!lead.analysis) return '';
    const { profitPotential, dealScore } = lead.analysis;

    if (profitPotential < 0) {
      return 'bg-red-100 dark:bg-red-900'; // Unprofitable
    } else if (dealScore < 85) {
      return 'bg-orange-100 dark:bg-orange-900'; // Borderline
    } else {
      return 'bg-green-100 dark:bg-green-900'; // Profitable
    }
  };

  const handleExport = () => {
    const headers = ["Name", "Phone", "Email", "Address", "City", "State", "Zip", "Fresh Start Amount", "Created At", "Market Value", "Mortgage Balance", "Equity", "Profit Potential", "Deal Score", "Status"];
    const rows = leads.map(lead => [
      lead.name,
      lead.phone,
      lead.email,
      lead.address,
      lead.city,
      lead.state,
      lead.zip,
      lead.freshStartAmount,
      new Date(lead.createdAt).toLocaleDateString(),
      lead.analysis?.marketValue || '',
      lead.analysis?.mortgageBalance || '',
      lead.analysis?.equity || '',
      lead.analysis?.profitPotential || '',
      lead.analysis?.dealScore || '',
      lead.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Reporting</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Filter leads..."
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white bg-white dark:bg-gray-700"
            value={reportingFilter}
            onChange={(e) => setReportingFilter(e.target.value)}
          />
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestReportingSort('name')}>Name</th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestReportingSort('address')}>Address</th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestReportingSort('freshStartAmount')}>Amount</th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestReportingSort('createdAt')}>Created</th>
              <th className="py-3 px-6 text-left">Market Value</th>
              <th className="py-3 px-6 text-left">Profit Potential</th>
              <th className="py-3 px-6 text-left">Deal Score</th>
              <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestReportingSort('status')}>Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
            {leads.map((lead) => (
              <tr key={lead._id} className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${getRowClass(lead)}`}>
                <td className="py-3 px-6 text-left whitespace-nowrap">{lead.name}</td>
                <td className="py-3 px-6 text-left">{formatAddress(lead)}</td>
                <td className="py-3 px-6 text-left">${lead.freshStartAmount.toLocaleString()}</td>
                <td className="py-3 px-6 text-left">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{lead.analysis?.marketValue ? `$${lead.analysis.marketValue.toLocaleString()}` : 'N/A'}</td>
                <td className="py-3 px-6 text-left">{lead.analysis?.profitPotential ? `$${lead.analysis.profitPotential.toLocaleString()}` : 'N/A'}</td>
                <td className="py-3 px-6 text-left text-gray-900 dark:text-white">{lead.analysis?.dealScore !== undefined && lead.analysis?.dealScore !== null ? lead.analysis.dealScore : 'N/A'}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-full text-xs ${lead.status === 'New' ? 'bg-blue-200 text-blue-600' : 'bg-green-200 text-green-600'}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'ascending' | 'descending' } | null>(null);
  const [reportingFilter, setReportingFilter] = useState('');
  const [reportingSortConfig, setReportingSortConfig] = useState<{ key: keyof Lead; direction: 'ascending' | 'descending' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    const filteredLeads = leads.filter(lead => {
      const name = lead.name || '';
      const address = lead.address || '';
      return name.toLowerCase().includes(filter.toLowerCase()) ||
             address.toLowerCase().includes(filter.toLowerCase());
    });

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

  const sortedAndFilteredReportingLeads = useMemo(() => {
    const filteredLeads = leads.filter(lead => {
      const name = lead.name || '';
      const address = lead.address || '';
      return name.toLowerCase().includes(reportingFilter.toLowerCase()) ||
             address.toLowerCase().includes(reportingFilter.toLowerCase());
    });

    if (reportingSortConfig !== null) {
      filteredLeads.sort((a, b) => {
        const aValue = String(a[reportingSortConfig.key] || '');
        const bValue = String(b[reportingSortConfig.key] || '');

        if (aValue < bValue) {
          return reportingSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return reportingSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredLeads;
  }, [leads, reportingFilter, reportingSortConfig]);

  const requestSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const requestReportingSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (reportingSortConfig && reportingSortConfig.key === key && reportingSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setReportingSortConfig({ key, direction });
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    console.log('Selected Lead:', lead);
    if (isMobileView) {
      setIsModalOpen(true);
    }
    if (lead.analysis) {
      setAnalysis(lead.analysis);
      setAnalyzing(false);
      console.log('Existing Analysis:', lead.analysis);
      console.log('Existing Deal Score:', lead.analysis.dealScore);
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
        console.log('New Analysis:', newAnalysis);
        console.log('New Deal Score:', newAnalysis.dealScore);
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
      await fetchLeads(); // Refetch leads to update the list
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
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-screen-xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8 max-w-screen-xl">
        <div className="flex flex-col md:flex-row">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Leads</h2>
              <input
                type="text"
                placeholder="Filter by name or address..."
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white bg-white dark:bg-gray-700"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            {isMobileView ? (
              <LeadCards leads={sortedAndFilteredLeads} handleLeadSelect={handleLeadSelect} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} handleSave={handleSave} handleDelete={handleDelete} menuRef={menuRef} formatAddress={formatAddress} />
            ) : (
              <LeadTable leads={sortedAndFilteredLeads} handleLeadSelect={handleLeadSelect} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} handleSave={handleSave} handleDelete={handleDelete} menuRef={menuRef} requestSort={requestSort} />
            )}
          </div>
          {!isMobileView && (
            <DesktopAnalysisDisplay selectedLead={selectedLead} analysis={analysis} analyzing={analyzing} formatAddress={formatAddress} />
          )}
        </div>
        <ReportingCard
          leads={sortedAndFilteredReportingLeads}
          reportingFilter={reportingFilter}
          setReportingFilter={setReportingFilter}
          reportingSortConfig={reportingSortConfig}
          requestReportingSort={requestReportingSort}
          formatAddress={formatAddress}
        />
        {isMobileView && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {selectedLead && (
              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-white">{selectedLead.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{formatAddress(selectedLead)}</p>
                </div>
                {analyzing && (
                  <div className="flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <p className="dark:text-white">Connecting to DeKalb County Records...</p>
                      <p className="dark:text-white">Fetching Market Comps...</p>
                      <p className="dark:text-white">Analyzing Mortgage & Liens...</p>
                      <p className="dark:text-white">Vetting Complete!</p>
                    </div>
                  </div>
                )}
                {analysis && (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Market Value</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.marketValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Mortgage Balance</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.mortgageBalance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Equity</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.equity.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Profit Potential</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">${analysis.profitPotential.toLocaleString()}</p>
                      </div>
                    </div>
                    {(() => {
                      let recommendationText = "";
                      let bgColorClass = "";
                      let textColorClass = "";

                      if (analysis.profitPotential < 0) {
                        recommendationText = "UNPROFITABLE";
                        bgColorClass = "bg-red-100 dark:bg-red-900";
                        textColorClass = "text-red-600 dark:text-red-300";
                      } else if (analysis.dealScore < 85) {
                        recommendationText = "BORDERLINE - LOW DEAL SCORE";
                        bgColorClass = "bg-orange-100 dark:bg-orange-900";
                        textColorClass = "text-orange-600 dark:text-orange-300";
                      } else {
                        recommendationText = "GO - HIGH PROFIT POTENTIAL";
                        bgColorClass = "bg-green-100 dark:bg-green-900";
                        textColorClass = "text-green-600 dark:text-green-300";
                      }

                      return (
                        <div className={`text-center p-4 rounded-lg ${bgColorClass}`}>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Recommendation</p>
                          <p className={`font-bold text-2xl ${textColorClass}`}>{recommendationText}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Deal Score</p>
                          <p className="font-bold text-xl text-black dark:text-white">{analysis.dealScore}/100</p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </Modal>
        )}
      </main>
    </div>
  );
}
