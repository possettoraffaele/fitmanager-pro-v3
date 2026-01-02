'use client';

import { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Calendar,
  User,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  Download,
  Copy
} from 'lucide-react';
import Link from 'next/link';

interface Cliente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
}

interface Programma {
  id: string;
  cliente_id: string;
  anamnesi_id: string | null;
  nome: string;
  tipo: 'base' | 'periodizzato';
  stato: 'bozza' | 'attivo' | 'completato' | 'archiviato';
  data_inizio: string | null;
  data_fine: string | null;
  contenuto_json: any;
  fase_corrente: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  clienti?: Cliente;
}

export default function ProgrammiPage() {
  const [programmi, setProgrammi] = useState<Programma[]>([]);
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStato, setFilterStato] = useState<string>('');
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [selectedProgramma, setSelectedProgramma] = useState<Programma | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [programmaToDelete, setProgrammaToDelete] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchProgrammi();
    fetchClienti();
  }, []);

  const fetchProgrammi = async () => {
    try {
      const response = await fetch('/api/programmi');
      if (response.ok) {
        const data = await response.json();
        setProgrammi(data);
      }
    } catch (error) {
      console.error('Error fetching programmi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClienti = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClienti(data);
      }
    } catch (error) {
      console.error('Error fetching clienti:', error);
    }
  };

  const handleDelete = async () => {
    if (!programmaToDelete) return;
    
    try {
      const response = await fetch(`/api/programmi?id=${programmaToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProgrammi(programmi.filter(p => p.id !== programmaToDelete));
        setShowDeleteConfirm(false);
        setProgrammaToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting programma:', error);
    }
  };

  const handleStatusChange = async (id: string, nuovoStato: string) => {
    try {
      const response = await fetch('/api/programmi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stato: nuovoStato }),
      });

      if (response.ok) {
        setProgrammi(programmi.map(p => 
          p.id === id ? { ...p, stato: nuovoStato as any } : p
        ));
      }
    } catch (error) {
      console.error('Error updating stato:', error);
    }
    setMenuOpen(null);
  };

  const copyJSON = (programma: Programma) => {
    if (programma.contenuto_json) {
      navigator.clipboard.writeText(
        typeof programma.contenuto_json === 'string' 
          ? programma.contenuto_json 
          : JSON.stringify(programma.contenuto_json, null, 2)
      );
      alert('JSON copiato negli appunti!');
    }
    setMenuOpen(null);
  };

  const getStatoBadge = (stato: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      bozza: { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText },
      attivo: { bg: 'bg-green-100', text: 'text-green-700', icon: PlayCircle },
      completato: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
      archiviato: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: XCircle },
    };
    const badge = badges[stato] || badges.bozza;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={12} />
        {stato.charAt(0).toUpperCase() + stato.slice(1)}
      </span>
    );
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'periodizzato' 
      ? <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Periodizzato</span>
      : <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">Base</span>;
  };

  const filteredProgrammi = programmi.filter(p => {
    const clienteNome = p.clienti ? `${p.clienti.nome} ${p.clienti.cognome}`.toLowerCase() : '';
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       clienteNome.includes(searchTerm.toLowerCase());
    const matchStato = !filterStato || p.stato === filterStato;
    const matchTipo = !filterTipo || p.tipo === filterTipo;
    return matchSearch && matchStato && matchTipo;
  });

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Dumbbell className="text-blue-600" />
            Programmi di Allenamento
          </h1>
          <p className="text-gray-600 mt-1">Gestisci i programmi dei tuoi clienti</p>
        </div>
        <Link
          href="/dashboard/generate"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
        >
          <Sparkles size={18} />
          Genera con AI
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cerca per nome programma o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStato}
            onChange={(e) => setFilterStato(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti gli stati</option>
            <option value="bozza">Bozza</option>
            <option value="attivo">Attivo</option>
            <option value="completato">Completato</option>
            <option value="archiviato">Archiviato</option>
          </select>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i tipi</option>
            <option value="base">Base</option>
            <option value="periodizzato">Periodizzato</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Totali</p>
          <p className="text-2xl font-bold text-gray-900">{programmi.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Attivi</p>
          <p className="text-2xl font-bold text-green-600">
            {programmi.filter(p => p.stato === 'attivo').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">In Bozza</p>
          <p className="text-2xl font-bold text-gray-600">
            {programmi.filter(p => p.stato === 'bozza').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completati</p>
          <p className="text-2xl font-bold text-blue-600">
            {programmi.filter(p => p.stato === 'completato').length}
          </p>
        </div>
      </div>

      {/* Programs List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProgrammi.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Dumbbell className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nessun programma trovato</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm || filterStato || filterTipo 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia generando il primo programma con l\'AI'}
          </p>
          <Link
            href="/dashboard/generate"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Sparkles size={18} />
            Genera Programma
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Programma
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Periodo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProgrammi.map((programma) => (
                  <tr key={programma.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Dumbbell className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{programma.nome}</p>
                          <p className="text-xs text-gray-500">
                            Creato: {formatDate(programma.created_at)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {programma.clienti ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {programma.clienti.nome[0]}{programma.clienti.cognome[0]}
                            </span>
                          </div>
                          <span className="text-gray-700">
                            {programma.clienti.nome} {programma.clienti.cognome}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {getTipoBadge(programma.tipo)}
                    </td>
                    <td className="px-4 py-4">
                      {getStatoBadge(programma.stato)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        {formatDate(programma.data_inizio)} - {formatDate(programma.data_fine)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === programma.id ? null : programma.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-500" />
                        </button>
                        
                        {menuOpen === programma.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                            <button
                              onClick={() => {
                                setSelectedProgramma(programma);
                                setShowViewModal(true);
                                setMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye size={16} />
                              Visualizza
                            </button>
                            {programma.contenuto_json && (
                              <button
                                onClick={() => copyJSON(programma)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy size={16} />
                                Copia JSON
                              </button>
                            )}
                            <hr className="my-1" />
                            {programma.stato !== 'attivo' && (
                              <button
                                onClick={() => handleStatusChange(programma.id, 'attivo')}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                              >
                                <PlayCircle size={16} />
                                Attiva
                              </button>
                            )}
                            {programma.stato !== 'completato' && (
                              <button
                                onClick={() => handleStatusChange(programma.id, 'completato')}
                                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                              >
                                <CheckCircle size={16} />
                                Completa
                              </button>
                            )}
                            {programma.stato !== 'archiviato' && (
                              <button
                                onClick={() => handleStatusChange(programma.id, 'archiviato')}
                                className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                              >
                                <XCircle size={16} />
                                Archivia
                              </button>
                            )}
                            <hr className="my-1" />
                            <button
                              onClick={() => {
                                setProgrammaToDelete(programma.id);
                                setShowDeleteConfirm(true);
                                setMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Elimina
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedProgramma && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedProgramma.nome}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedProgramma.clienti && 
                      `${selectedProgramma.clienti.nome} ${selectedProgramma.clienti.cognome}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getTipoBadge(selectedProgramma.tipo)}
                  {getStatoBadge(selectedProgramma.stato)}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Data Inizio</p>
                  <p className="font-medium">{formatDate(selectedProgramma.data_inizio)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Data Fine</p>
                  <p className="font-medium">{formatDate(selectedProgramma.data_fine)}</p>
                </div>
              </div>
              
              {selectedProgramma.note && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Note</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedProgramma.note}</p>
                </div>
              )}
              
              {selectedProgramma.contenuto_json && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contenuto JSON</h3>
                  <pre className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto text-sm">
                    {typeof selectedProgramma.contenuto_json === 'string' 
                      ? selectedProgramma.contenuto_json 
                      : JSON.stringify(selectedProgramma.contenuto_json, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (selectedProgramma.contenuto_json) {
                    navigator.clipboard.writeText(
                      typeof selectedProgramma.contenuto_json === 'string' 
                        ? selectedProgramma.contenuto_json 
                        : JSON.stringify(selectedProgramma.contenuto_json, null, 2)
                    );
                    alert('JSON copiato!');
                  }
                }}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Copy size={16} />
                Copia JSON
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProgramma(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Conferma Eliminazione</h2>
            <p className="text-gray-600 mb-6">
              Sei sicuro di voler eliminare questo programma? L'azione non può essere annullata.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProgrammaToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
