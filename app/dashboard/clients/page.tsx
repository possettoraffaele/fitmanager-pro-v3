'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  ChevronRight,
  AlertCircle,
  Check
} from 'lucide-react';
import Link from 'next/link';

interface Cliente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  data_nascita?: string;
  sesso?: string;
  note?: string;
  created_at: string;
}

export default function ClientiPage() {
  const searchParams = useSearchParams();
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    data_nascita: '',
    sesso: '',
    note: ''
  });

  useEffect(() => {
    fetchClienti();
    // Apri modal se parametro new=true
    if (searchParams.get('new') === 'true') {
      openNewModal();
    }
  }, [searchParams]);

  const fetchClienti = async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClienti(data);
      }
    } catch (error) {
      console.error('Errore caricamento clienti:', error);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingCliente(null);
    setForm({
      nome: '',
      cognome: '',
      email: '',
      telefono: '',
      data_nascita: '',
      sesso: '',
      note: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setForm({
      nome: cliente.nome,
      cognome: cliente.cognome,
      email: cliente.email,
      telefono: cliente.telefono || '',
      data_nascita: cliente.data_nascita || '',
      sesso: cliente.sesso || '',
      note: cliente.note || ''
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCliente(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const method = editingCliente ? 'PUT' : 'POST';
      const body = editingCliente 
        ? { id: editingCliente.id, ...form }
        : form;

      const res = await fetch('/api/clients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setSuccess(editingCliente ? 'Cliente aggiornato!' : 'Cliente creato!');
        setTimeout(() => setSuccess(''), 3000);
        closeModal();
        fetchClienti();
      } else {
        const data = await res.json();
        setError(data.error || 'Errore nel salvataggio');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Cliente eliminato!');
        setTimeout(() => setSuccess(''), 3000);
        setDeleteConfirm(null);
        fetchClienti();
      }
    } catch {
      setError('Errore eliminazione');
    }
  };

  const filteredClienti = clienti.filter(c => 
    `${c.nome} ${c.cognome} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clienti</h1>
          <p className="text-slate-500">Gestisci i tuoi clienti</p>
        </div>
        <button onClick={openNewModal} className="btn-primary">
          <Plus className="w-5 h-5" />
          Nuovo Cliente
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="toast-success flex items-center gap-2">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Cerca clienti..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Lista clienti */}
      {loading ? (
        <div className="card">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredClienti.length === 0 ? (
        <div className="card text-center py-12">
          <User className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">
            {search ? 'Nessun cliente trovato' : 'Nessun cliente registrato'}
          </p>
          {!search && (
            <button onClick={openNewModal} className="btn-primary">
              <Plus className="w-5 h-5" />
              Aggiungi il primo cliente
            </button>
          )}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredClienti.map((cliente) => (
              <div 
                key={cliente.id} 
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {cliente.nome[0]}{cliente.cognome[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {cliente.nome} {cliente.cognome}
                  </h3>
                  <p className="text-sm text-slate-500 truncate">{cliente.email}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {deleteConfirm === cliente.id ? (
                    <>
                      <button 
                        onClick={() => handleDelete(cliente.id)}
                        className="btn-danger text-sm py-1.5 px-3"
                      >
                        Conferma
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(null)}
                        className="btn-secondary text-sm py-1.5 px-3"
                      >
                        Annulla
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => openEditModal(cliente)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(cliente.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <Link 
                        href={`/dashboard/anamnesi?cliente=${cliente.id}`}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Anamnesi"
                      >
                        <FileText className="w-5 h-5" />
                      </Link>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingCliente ? 'Modifica Cliente' : 'Nuovo Cliente'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nome *</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Cognome *</label>
                  <input
                    type="text"
                    value={form.cognome}
                    onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefono
                </label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Data nascita
                  </label>
                  <input
                    type="date"
                    value={form.data_nascita}
                    onChange={(e) => setForm({ ...form, data_nascita: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Sesso</label>
                  <select
                    value={form.sesso}
                    onChange={(e) => setForm({ ...form, sesso: e.target.value })}
                    className="select"
                  >
                    <option value="">Seleziona...</option>
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Note</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="textarea"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Annulla
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? (
                    <>
                      <div className="spinner w-5 h-5 border-white/30 border-t-white"></div>
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {editingCliente ? 'Salva' : 'Crea'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
