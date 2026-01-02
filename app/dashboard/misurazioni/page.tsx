'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, 
  Plus, 
  X, 
  Check, 
  AlertCircle,
  Scale,
  Percent,
  Flame,
  Droplets,
  Bone,
  TrendingUp
} from 'lucide-react';

interface Cliente {
  id: string;
  nome: string;
  cognome: string;
}

interface Misurazione {
  id: string;
  cliente_id: string;
  data_misurazione: string;
  peso_kg: number;
  grasso_percentuale?: number;
  bmi?: number;
  muscolo_scheletrico_percentuale?: number;
  massa_muscolare_kg?: number;
  proteine_percentuale?: number;
  metabolismo_basale_kcal?: number;
  grasso_viscerale_livello?: number;
  idratazione_percentuale?: number;
  massa_ossea_kg?: number;
  eta_metabolica?: number;
  clienti?: { nome: string; cognome: string };
}

export default function MisurazioniPage() {
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [misurazioni, setMisurazioni] = useState<Misurazione[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');

  const [form, setForm] = useState({
    cliente_id: '',
    data_misurazione: new Date().toISOString().split('T')[0],
    peso_kg: '',
    grasso_percentuale: '',
    bmi: '',
    muscolo_scheletrico_percentuale: '',
    massa_muscolare_kg: '',
    proteine_percentuale: '',
    metabolismo_basale_kcal: '',
    grasso_viscerale_livello: '',
    idratazione_percentuale: '',
    massa_ossea_kg: '',
    eta_metabolica: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientiRes, misurazioniRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/misurazioni')
      ]);

      if (clientiRes.ok) {
        const data = await clientiRes.json();
        setClienti(data);
      }

      if (misurazioniRes.ok) {
        const data = await misurazioniRes.json();
        setMisurazioni(data);
      }
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setForm({
      cliente_id: '',
      data_misurazione: new Date().toISOString().split('T')[0],
      peso_kg: '',
      grasso_percentuale: '',
      bmi: '',
      muscolo_scheletrico_percentuale: '',
      massa_muscolare_kg: '',
      proteine_percentuale: '',
      metabolismo_basale_kcal: '',
      grasso_viscerale_livello: '',
      idratazione_percentuale: '',
      massa_ossea_kg: '',
      eta_metabolica: ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: Record<string, string | number> = {
        cliente_id: form.cliente_id,
        data_misurazione: form.data_misurazione,
        peso_kg: parseFloat(form.peso_kg)
      };

      // Aggiungi solo i campi compilati
      if (form.grasso_percentuale) payload.grasso_percentuale = parseFloat(form.grasso_percentuale);
      if (form.bmi) payload.bmi = parseFloat(form.bmi);
      if (form.muscolo_scheletrico_percentuale) payload.muscolo_scheletrico_percentuale = parseFloat(form.muscolo_scheletrico_percentuale);
      if (form.massa_muscolare_kg) payload.massa_muscolare_kg = parseFloat(form.massa_muscolare_kg);
      if (form.proteine_percentuale) payload.proteine_percentuale = parseFloat(form.proteine_percentuale);
      if (form.metabolismo_basale_kcal) payload.metabolismo_basale_kcal = parseInt(form.metabolismo_basale_kcal);
      if (form.grasso_viscerale_livello) payload.grasso_viscerale_livello = parseInt(form.grasso_viscerale_livello);
      if (form.idratazione_percentuale) payload.idratazione_percentuale = parseFloat(form.idratazione_percentuale);
      if (form.massa_ossea_kg) payload.massa_ossea_kg = parseFloat(form.massa_ossea_kg);
      if (form.eta_metabolica) payload.eta_metabolica = parseInt(form.eta_metabolica);

      const res = await fetch('/api/misurazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess('Misurazione salvata!');
        setTimeout(() => setSuccess(''), 3000);
        setShowModal(false);
        fetchData();
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

  const filteredMisurazioni = selectedCliente 
    ? misurazioni.filter(m => m.cliente_id === selectedCliente)
    : misurazioni;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Misurazioni</h1>
          <p className="text-slate-500">Parametri bioimpedenziometrici Feelfit</p>
        </div>
        <button onClick={openModal} className="btn-primary">
          <Plus className="w-5 h-5" />
          Nuova Misurazione
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="toast-success flex items-center gap-2">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Filtro cliente */}
      <div className="card">
        <label className="label">Filtra per cliente</label>
        <select
          value={selectedCliente}
          onChange={(e) => setSelectedCliente(e.target.value)}
          className="select"
        >
          <option value="">Tutti i clienti</option>
          {clienti.map(c => (
            <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>
          ))}
        </select>
      </div>

      {/* Lista misurazioni */}
      {filteredMisurazioni.length === 0 ? (
        <div className="card text-center py-12">
          <Activity className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">Nessuna misurazione registrata</p>
          <button onClick={openModal} className="btn-primary">
            <Plus className="w-5 h-5" />
            Aggiungi la prima misurazione
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMisurazioni.map((m) => (
            <div key={m.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {m.clienti?.nome} {m.clienti?.cognome}
                  </h3>
                  <p className="text-sm text-slate-500">{formatDate(m.data_misurazione)}</p>
                </div>
                <span className="badge-primary">
                  {m.peso_kg} kg
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {m.grasso_percentuale && (
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-500">Grasso</p>
                      <p className="font-medium">{m.grasso_percentuale}%</p>
                    </div>
                  </div>
                )}
                {m.massa_muscolare_kg && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-500">Muscolo</p>
                      <p className="font-medium">{m.massa_muscolare_kg} kg</p>
                    </div>
                  </div>
                )}
                {m.metabolismo_basale_kcal && (
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs text-slate-500">BMR</p>
                      <p className="font-medium">{m.metabolismo_basale_kcal} kcal</p>
                    </div>
                  </div>
                )}
                {m.idratazione_percentuale && (
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500">Idratazione</p>
                      <p className="font-medium">{m.idratazione_percentuale}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal nuova misurazione */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-800">Nuova Misurazione</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Cliente e Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Cliente *</label>
                  <select
                    value={form.cliente_id}
                    onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
                    className="select"
                    required
                  >
                    <option value="">Seleziona...</option>
                    {clienti.map(c => (
                      <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Data *</label>
                  <input
                    type="date"
                    value={form.data_misurazione}
                    onChange={(e) => setForm({ ...form, data_misurazione: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* Parametri principali */}
              <div className="form-section">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary-500" />
                  Parametri Principali
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Peso (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.peso_kg}
                      onChange={(e) => setForm({ ...form, peso_kg: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Grasso (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.grasso_percentuale}
                      onChange={(e) => setForm({ ...form, grasso_percentuale: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">BMI</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.bmi}
                      onChange={(e) => setForm({ ...form, bmi: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Parametri muscolari */}
              <div className="form-section">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Composizione Muscolare
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Muscolo scheletrico (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.muscolo_scheletrico_percentuale}
                      onChange={(e) => setForm({ ...form, muscolo_scheletrico_percentuale: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Massa muscolare (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.massa_muscolare_kg}
                      onChange={(e) => setForm({ ...form, massa_muscolare_kg: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Proteine (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.proteine_percentuale}
                      onChange={(e) => setForm({ ...form, proteine_percentuale: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Altri parametri */}
              <div className="form-section">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Altri Parametri
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Metabolismo basale (kcal)</label>
                    <input
                      type="number"
                      value={form.metabolismo_basale_kcal}
                      onChange={(e) => setForm({ ...form, metabolismo_basale_kcal: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Grasso viscerale (livello)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={form.grasso_viscerale_livello}
                      onChange={(e) => setForm({ ...form, grasso_viscerale_livello: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Idratazione (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.idratazione_percentuale}
                      onChange={(e) => setForm({ ...form, idratazione_percentuale: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Massa ossea (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.massa_ossea_kg}
                      onChange={(e) => setForm({ ...form, massa_ossea_kg: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Età metabolica</label>
                    <input
                      type="number"
                      value={form.eta_metabolica}
                      onChange={(e) => setForm({ ...form, eta_metabolica: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
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
                      Salva
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
