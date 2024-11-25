import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Search, Calendar, User, Download, Mail } from 'lucide-react';
import { useTemplates } from '../context/TemplateContext';
import EmailTemplate from './EmailTemplate';

interface HistoryEntry {
  id: string;
  templateId: string;
  templateName: string;
  clientName: string;
  createdAt: string;
  values: Record<string, string>;
}

export default function History() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { templates } = useTemplates();

  // Simuler des données d'historique
  const historyEntries: HistoryEntry[] = [
    // Ici, nous chargerions les vraies données d'historique
  ];

  const filteredEntries = historyEntries.filter(entry => {
    const matchesSearch = 
      entry.templateName.toLowerCase().includes(search.toLowerCase()) ||
      entry.clientName.toLowerCase().includes(search.toLowerCase());
    
    const matchesDate = !dateFilter || 
      format(new Date(entry.createdAt), 'yyyy-MM-dd') === dateFilter;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {entry.templateName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                      {entry.clientName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                      {format(new Date(entry.createdAt), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      // Télécharger le document
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 mr-2"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEntry(entry);
                      setShowEmailModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Envoyer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEmailModal && selectedEntry && (
        <EmailTemplate
          onClose={() => setShowEmailModal(false)}
          attachmentName={`${selectedEntry.templateName} - ${selectedEntry.clientName}.pdf`}
        />
      )}
    </div>
  );
}