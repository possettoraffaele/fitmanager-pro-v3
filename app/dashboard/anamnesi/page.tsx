'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ClipboardList, 
  User, 
  Ruler, 
  Calendar, 
  Heart, 
  Target, 
  Sliders,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Save
} from 'lucide-react';

interface Cliente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
}

interface AnamnesiData {
  [key: string]: string | number | boolean | string[] | undefined;
}

const SEZIONI = [
  { id: 0, titolo: 'Tipo Cliente', icon: User },
  { id: 1, titolo: 'Dati Personali', icon: User },
  { id: 2, titolo: 'Caratteristiche Fisiche', icon: Ruler },
  { id: 3, titolo: 'Modalità Allenamento', icon: Calendar },
  { id: 4, titolo: 'Esperienza Sportiva', icon: Target },
  { id: 5, titolo: 'Salute e Benessere', icon: Heart },
  { id: 6, titolo: 'Obiettivi', icon: Target },
  { id: 7, titolo: 'Preferenze', icon: Sliders },
  { id: 8, titolo: 'Note Finali', icon: FileText },
];

export default function AnamnesiPage() {
  const searchParams = useSearchParams();
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [sezioneAttiva, setSezioneAttiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<AnamnesiData>({
    // Sezione 0
    tipo_cliente: 'nuovo',
    conclusione_ultimo_programma: '',
    durata_programma_precedente: '',
    efficacia_programma_precedente: 5,
    modifiche_desiderate: '',
    esercizi_problematici: '',
    risultati_ottenuti: '',
    cambiamenti_situazione: '',
    
    // Sezione 1
    nome_cognome: '',
    email: '',
    telefono: '',
    data_nascita: '',
    sesso_biologico: '',
    professione: '',
    
    // Sezione 2
    altezza_cm: '',
    peso_kg: '',
    forma_fisica_voto: 5,
    
    // Sezione 3
    allenamenti_fissi_settimana: 3,
    allenamenti_facoltativi_settimana: 0,
    durata_sessione_minuti: 60,
    orario_allenamento: '',
    mobilita_pre: false,
    stretching_post: false,
    
    // Sezione 4
    livello_esperienza: '',
    sport_passato: false,
    sport_passato_dettagli: '',
    sport_attuale: false,
    sport_attuale_dettagli: '',
    massimali_attuali: '',
    
    // Sezione 5
    presenza_dolori: false,
    descrizione_dolori: '',
    storia_infortuni: false,
    dettagli_infortuni: '',
    patologie: [],
    altre_patologie_dettagli: '',
    farmaci_regolari: '',
    qualita_sonno_voto: 5,
    ore_sonno_media: '',
    livello_stress_voto: 5,
    
    // Sezione 6
    obiettivo_principale: '',
    obiettivo_secondario: '',
    obiettivi_specifici_dettagli: '',
    tempistica_obiettivo: '',
    motivazione_voto: 5,
    
    // Sezione 7
    esercizi_preferiti: '',
    esercizi_da_evitare: '',
    focus_gruppi_muscolari: '',
    
    // Sezione 8
    note_aggiuntive: '',
    domande_al_trainer: ''
  });

  useEffect(() => {
    fetchClienti();
    const clienteParam = searchParams.get('cliente');
    if (clienteParam) {
      setSelectedCliente(clienteParam);
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
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string | number | boolean | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedCliente) {
      setError('Seleziona un cliente');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/anamnesi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: selectedCliente,
          ...form
        })
      });

      if (res.ok) {
        setSuccess('Anamnesi salvata con successo!');
        setTimeout(() => setSuccess(''), 3000);
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

  const renderSezione = () => {
    switch (sezioneAttiva) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="form-group">
              <label className="label">È la prima volta che richiedi un programma?</label>
              <div className="flex gap-4">
                <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${form.tipo_cliente === 'nuovo' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    checked={form.tipo_cliente === 'nuovo'}
                    onChange={() => updateForm('tipo_cliente', 'nuovo')}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span>Sì, è la prima volta</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${form.tipo_cliente === 'ricorrente' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    checked={form.tipo_cliente === 'ricorrente'}
                    onChange={() => updateForm('tipo_cliente', 'ricorrente')}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span>No, ho già seguito un programma</span>
                </label>
              </div>
            </div>

            {form.tipo_cliente === 'ricorrente' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Bentornato!</strong> Le seguenti domande ci aiuteranno a creare un programma ancora più efficace.
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="label">Quando hai concluso l&apos;ultimo programma?</label>
                  <select
                    value={form.conclusione_ultimo_programma as string}
                    onChange={(e) => updateForm('conclusione_ultimo_programma', e.target.value)}
                    className="select"
                  >
                    <option value="">Seleziona...</option>
                    <option value="in_corso">Ancora in corso</option>
                    <option value="meno_1_settimana">Meno di 1 settimana fa</option>
                    <option value="1-2_settimane">1-2 settimane fa</option>
                    <option value="2-4_settimane">2-4 settimane fa</option>
                    <option value="1-2_mesi">1-2 mesi fa</option>
                    <option value="oltre_3_mesi">Oltre 3 mesi fa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Efficacia programma precedente: {form.efficacia_programma_precedente}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form.efficacia_programma_precedente as number}
                    onChange={(e) => updateForm('efficacia_programma_precedente', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Modifiche desiderate per il nuovo programma</label>
                  <textarea
                    value={form.modifiche_desiderate as string}
                    onChange={(e) => updateForm('modifiche_desiderate', e.target.value)}
                    className="textarea"
                    placeholder="Es: più focus su..., meno volume su..."
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Nome e Cognome *</label>
              <input
                type="text"
                value={form.nome_cognome as string}
                onChange={(e) => updateForm('nome_cognome', e.target.value)}
                className="input"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Email *</label>
                <input
                  type="email"
                  value={form.email as string}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Telefono</label>
                <input
                  type="tel"
                  value={form.telefono as string}
                  onChange={(e) => updateForm('telefono', e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Data di nascita *</label>
                <input
                  type="date"
                  value={form.data_nascita as string}
                  onChange={(e) => updateForm('data_nascita', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Sesso biologico *</label>
                <select
                  value={form.sesso_biologico as string}
                  onChange={(e) => updateForm('sesso_biologico', e.target.value)}
                  className="select"
                  required
                >
                  <option value="">Seleziona...</option>
                  <option value="Maschio">Maschio</option>
                  <option value="Femmina">Femmina</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="label">Professione/Occupazione *</label>
              <input
                type="text"
                value={form.professione as string}
                onChange={(e) => updateForm('professione', e.target.value)}
                className="input"
                placeholder="Es: impiegato, operaio, studente..."
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Altezza (cm) *</label>
                <input
                  type="number"
                  value={form.altezza_cm as string}
                  onChange={(e) => updateForm('altezza_cm', e.target.value)}
                  className="input"
                  min="120"
                  max="230"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Peso attuale (kg) *</label>
                <input
                  type="number"
                  value={form.peso_kg as string}
                  onChange={(e) => updateForm('peso_kg', e.target.value)}
                  className="input"
                  min="30"
                  max="200"
                  step="0.5"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Autovalutazione forma fisica: {form.forma_fisica_voto}/10</label>
              <p className="text-sm text-slate-500 mb-2">1 = completamente fuori forma, 10 = ottima forma fisica</p>
              <input
                type="range"
                min="1"
                max="10"
                value={form.forma_fisica_voto as number}
                onChange={(e) => updateForm('forma_fisica_voto', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Allenamenti FISSI a settimana *</label>
                <select
                  value={form.allenamenti_fissi_settimana as number}
                  onChange={(e) => updateForm('allenamenti_fissi_settimana', parseInt(e.target.value))}
                  className="select"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'volta' : 'volte'} a settimana</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Allenamenti FACOLTATIVI</label>
                <select
                  value={form.allenamenti_facoltativi_settimana as number}
                  onChange={(e) => updateForm('allenamenti_facoltativi_settimana', parseInt(e.target.value))}
                  className="select"
                >
                  {[0, 1, 2, 3].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'Nessuno' : `${n} facoltativ${n === 1 ? 'o' : 'i'}`}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Durata sessione *</label>
                <select
                  value={form.durata_sessione_minuti as number}
                  onChange={(e) => updateForm('durata_sessione_minuti', parseInt(e.target.value))}
                  className="select"
                  required
                >
                  <option value="30">30 minuti</option>
                  <option value="45">45 minuti</option>
                  <option value="60">60 minuti</option>
                  <option value="75">75 minuti</option>
                  <option value="90">90 minuti</option>
                  <option value="120">120 minuti</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Orario preferito</label>
                <select
                  value={form.orario_allenamento as string}
                  onChange={(e) => updateForm('orario_allenamento', e.target.value)}
                  className="select"
                >
                  <option value="">Seleziona...</option>
                  <option value="mattino_presto">Mattino presto (6:30-9:00)</option>
                  <option value="mattina">Mattina (9:00-12:00)</option>
                  <option value="pausa_pranzo">Pausa pranzo (12:00-14:00)</option>
                  <option value="pomeriggio">Pomeriggio (14:00-18:00)</option>
                  <option value="serale">Serale (18:00-22:00)</option>
                  <option value="variabile">Orario variabile</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`form-group cursor-pointer ${form.mobilita_pre ? 'ring-2 ring-primary-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.mobilita_pre as boolean}
                    onChange={(e) => updateForm('mobilita_pre', e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <div>
                    <span className="font-medium">Mobilità pre-allenamento</span>
                    <p className="text-sm text-slate-500">Routine di mobilità prima dell&apos;allenamento</p>
                  </div>
                </div>
              </label>
              <label className={`form-group cursor-pointer ${form.stretching_post ? 'ring-2 ring-primary-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.stretching_post as boolean}
                    onChange={(e) => updateForm('stretching_post', e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <div>
                    <span className="font-medium">Stretching post-allenamento</span>
                    <p className="text-sm text-slate-500">Routine di stretching dopo l&apos;allenamento</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Livello di esperienza *</label>
              <select
                value={form.livello_esperienza as string}
                onChange={(e) => updateForm('livello_esperienza', e.target.value)}
                className="select"
                required
              >
                <option value="">Seleziona...</option>
                <option value="principiante">Principiante (0-6 mesi)</option>
                <option value="intermedio_base">Intermedio Base (6-12 mesi)</option>
                <option value="intermedio">Intermedio (1-3 anni)</option>
                <option value="avanzato">Avanzato (3-5 anni)</option>
                <option value="esperto">Esperto (5+ anni)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="label">Hai praticato sport in passato?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.sport_passato === true}
                    onChange={() => updateForm('sport_passato', true)}
                    className="w-5 h-5"
                  />
                  <span>Sì</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.sport_passato === false}
                    onChange={() => updateForm('sport_passato', false)}
                    className="w-5 h-5"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {form.sport_passato && (
              <div className="form-group animate-fadeIn">
                <label className="label">Dettagli sport praticati</label>
                <textarea
                  value={form.sport_passato_dettagli as string}
                  onChange={(e) => updateForm('sport_passato_dettagli', e.target.value)}
                  className="textarea"
                  placeholder="Es: Calcio per 5 anni, Nuoto agonistico per 3 anni..."
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Massimali attuali (se conosciuti)</label>
              <textarea
                value={form.massimali_attuali as string}
                onChange={(e) => updateForm('massimali_attuali', e.target.value)}
                className="textarea"
                placeholder="Es: Squat 100kg, Panca 80kg, Stacco 120kg..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Presenza di dolori o fastidi?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.presenza_dolori === true}
                    onChange={() => updateForm('presenza_dolori', true)}
                    className="w-5 h-5"
                  />
                  <span>Sì</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.presenza_dolori === false}
                    onChange={() => updateForm('presenza_dolori', false)}
                    className="w-5 h-5"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {form.presenza_dolori && (
              <div className="form-group animate-fadeIn">
                <label className="label">Descrivi i dolori/fastidi</label>
                <textarea
                  value={form.descrizione_dolori as string}
                  onChange={(e) => updateForm('descrizione_dolori', e.target.value)}
                  className="textarea"
                  placeholder="Es: Dolore spalla destra durante spinte..."
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Storia di infortuni o interventi?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.storia_infortuni === true}
                    onChange={() => updateForm('storia_infortuni', true)}
                    className="w-5 h-5"
                  />
                  <span>Sì</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.storia_infortuni === false}
                    onChange={() => updateForm('storia_infortuni', false)}
                    className="w-5 h-5"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {form.storia_infortuni && (
              <div className="form-group animate-fadeIn">
                <label className="label">Dettagli infortuni/interventi</label>
                <textarea
                  value={form.dettagli_infortuni as string}
                  onChange={(e) => updateForm('dettagli_infortuni', e.target.value)}
                  className="textarea"
                  placeholder="Es: Rottura LCA nel 2020, completamente recuperato..."
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Farmaci assunti regolarmente</label>
              <textarea
                value={form.farmaci_regolari as string}
                onChange={(e) => updateForm('farmaci_regolari', e.target.value)}
                className="textarea"
                placeholder="Es: Eutirox, Ramipril..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Qualità sonno: {form.qualita_sonno_voto}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.qualita_sonno_voto as number}
                  onChange={(e) => updateForm('qualita_sonno_voto', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
              <div className="form-group">
                <label className="label">Livello stress: {form.livello_stress_voto}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.livello_stress_voto as number}
                  onChange={(e) => updateForm('livello_stress_voto', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Obiettivo PRINCIPALE *</label>
              <select
                value={form.obiettivo_principale as string}
                onChange={(e) => updateForm('obiettivo_principale', e.target.value)}
                className="select"
                required
              >
                <option value="">Seleziona...</option>
                <option value="dimagrimento">Dimagrimento/Perdita grasso</option>
                <option value="tonificazione">Tonificazione/Definizione</option>
                <option value="massa_muscolare">Aumento massa muscolare</option>
                <option value="forza">Aumento forza massimale</option>
                <option value="resistenza">Miglioramento resistenza</option>
                <option value="performance">Performance atletica</option>
                <option value="postura">Correzione posturale</option>
                <option value="riabilitazione">Riabilitazione</option>
                <option value="mobilita">Miglioramento mobilità</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Obiettivo SECONDARIO</label>
              <select
                value={form.obiettivo_secondario as string}
                onChange={(e) => updateForm('obiettivo_secondario', e.target.value)}
                className="select"
              >
                <option value="">Nessuno</option>
                <option value="dimagrimento">Dimagrimento/Perdita grasso</option>
                <option value="tonificazione">Tonificazione/Definizione</option>
                <option value="massa_muscolare">Aumento massa muscolare</option>
                <option value="forza">Aumento forza massimale</option>
                <option value="resistenza">Miglioramento resistenza</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Obiettivi specifici misurabili</label>
              <textarea
                value={form.obiettivi_specifici_dettagli as string}
                onChange={(e) => updateForm('obiettivi_specifici_dettagli', e.target.value)}
                className="textarea"
                placeholder="Es: Perdere 8kg in 3 mesi, 10 trazioni complete..."
              />
            </div>

            <div className="form-group">
              <label className="label">Tempistica obiettivo *</label>
              <select
                value={form.tempistica_obiettivo as string}
                onChange={(e) => updateForm('tempistica_obiettivo', e.target.value)}
                className="select"
                required
              >
                <option value="">Seleziona...</option>
                <option value="1_mese">1 mese</option>
                <option value="2_mesi">2 mesi</option>
                <option value="3_mesi">3 mesi</option>
                <option value="6_mesi">6 mesi</option>
                <option value="12_mesi">12 mesi</option>
                <option value="senza_fretta">Senza fretta particolare</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Motivazione: {form.motivazione_voto}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={form.motivazione_voto as number}
                onChange={(e) => updateForm('motivazione_voto', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Esercizi che AMI fare</label>
              <textarea
                value={form.esercizi_preferiti as string}
                onChange={(e) => updateForm('esercizi_preferiti', e.target.value)}
                className="textarea"
                placeholder="Es: Squat, panca, trazioni..."
              />
            </div>

            <div className="form-group">
              <label className="label">Esercizi che DETESTI o vuoi evitare</label>
              <textarea
                value={form.esercizi_da_evitare as string}
                onChange={(e) => updateForm('esercizi_da_evitare', e.target.value)}
                className="textarea"
                placeholder="Es: Burpees, leg extension..."
              />
            </div>

            <div className="form-group">
              <label className="label">Gruppi muscolari da enfatizzare</label>
              <textarea
                value={form.focus_gruppi_muscolari as string}
                onChange={(e) => updateForm('focus_gruppi_muscolari', e.target.value)}
                className="textarea"
                placeholder="Es: Glutei e gambe, pettorali, braccia..."
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Note aggiuntive</label>
              <textarea
                value={form.note_aggiuntive as string}
                onChange={(e) => updateForm('note_aggiuntive', e.target.value)}
                className="textarea"
                rows={4}
                placeholder="Qualsiasi informazione importante..."
              />
            </div>

            <div className="form-group">
              <label className="label">Domande per il trainer</label>
              <textarea
                value={form.domande_al_trainer as string}
                onChange={(e) => updateForm('domande_al_trainer', e.target.value)}
                className="textarea"
                rows={3}
                placeholder="Hai domande specifiche?"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Anamnesi Psicofisica</h1>
        <p className="text-slate-500">Compila il questionario per creare un programma personalizzato</p>
      </div>

      {/* Selezione cliente */}
      <div className="card">
        <label className="label">Seleziona Cliente</label>
        <select
          value={selectedCliente}
          onChange={(e) => setSelectedCliente(e.target.value)}
          className="select"
        >
          <option value="">Seleziona un cliente...</option>
          {clienti.map(c => (
            <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>
          ))}
        </select>
      </div>

      {selectedCliente && (
        <>
          {/* Progress bar */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              {SEZIONI.map((sezione, index) => (
                <button
                  key={sezione.id}
                  onClick={() => setSezioneAttiva(sezione.id)}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    index <= sezioneAttiva ? 'bg-primary-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500 text-center">
              Sezione {sezioneAttiva + 1} di {SEZIONI.length}: {SEZIONI[sezioneAttiva].titolo}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
          {success && (
            <div className="toast-success flex items-center gap-2">
              <Check className="w-5 h-5" />
              {success}
            </div>
          )}

          {/* Form sezione */}
          <div className="card">
            <div className="form-section-title mb-6">
              <span className="form-section-number">{sezioneAttiva}</span>
              {SEZIONI[sezioneAttiva].titolo}
            </div>
            
            {renderSezione()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={() => setSezioneAttiva(Math.max(0, sezioneAttiva - 1))}
                disabled={sezioneAttiva === 0}
                className="btn-secondary"
              >
                <ChevronLeft className="w-5 h-5" />
                Precedente
              </button>

              {sezioneAttiva < SEZIONI.length - 1 ? (
                <button
                  onClick={() => setSezioneAttiva(sezioneAttiva + 1)}
                  className="btn-primary"
                >
                  Successivo
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="btn-success"
                >
                  {saving ? (
                    <>
                      <div className="spinner w-5 h-5 border-white/30 border-t-white"></div>
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salva Anamnesi
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
