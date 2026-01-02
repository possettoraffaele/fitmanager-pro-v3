// Database Types per FitManager Pro v4

export interface Cliente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  data_nascita?: string;
  sesso?: 'M' | 'F';
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Anamnesi {
  id: string;
  cliente_id: string;
  
  // Sezione 0: Tipo Cliente
  tipo_cliente: 'nuovo' | 'ricorrente';
  conclusione_ultimo_programma?: string;
  durata_programma_precedente?: string;
  efficacia_programma_precedente?: number;
  aspetti_positivi_precedente?: string[];
  modifiche_desiderate?: string;
  esercizi_problematici?: string;
  risultati_ottenuti?: string;
  cambiamenti_situazione?: string;
  
  // Sezione 1: Informazioni Personali
  nome_cognome: string;
  email: string;
  telefono?: string;
  data_nascita: string;
  sesso_biologico: 'Maschio' | 'Femmina';
  professione: string;
  
  // Sezione 2: Caratteristiche Fisiche
  altezza_cm: number;
  peso_kg: number;
  forma_fisica_voto: number;
  
  // Sezione 3: Modalità di Allenamento
  allenamenti_fissi_settimana: number;
  allenamenti_facoltativi_settimana: number;
  giorni_fissi_specifici?: string[];
  giorni_facoltativi_specifici?: string[];
  durata_sessione_minuti: number;
  orario_allenamento: string;
  mobilita_pre: boolean;
  stretching_post: boolean;
  
  // Sezione 4: Esperienza Sportiva
  livello_esperienza: string;
  sport_passato: boolean;
  sport_passato_dettagli?: string;
  sport_attuale: boolean;
  sport_attuale_dettagli?: string;
  massimali_attuali?: string;
  
  // Sezione 5: Salute e Benessere
  presenza_dolori: boolean;
  descrizione_dolori?: string;
  storia_infortuni: boolean;
  dettagli_infortuni?: string;
  patologie: string[];
  altre_patologie_dettagli?: string;
  farmaci_regolari?: string;
  qualita_sonno_voto: number;
  ore_sonno_media: string;
  livello_stress_voto: number;
  
  // Sezione 6: Obiettivi
  obiettivo_principale: string;
  obiettivo_secondario?: string;
  obiettivi_specifici_dettagli?: string;
  tempistica_obiettivo: string;
  motivazione_voto: number;
  
  // Sezione 7: Preferenze
  esercizi_preferiti?: string;
  esercizi_da_evitare?: string;
  focus_gruppi_muscolari?: string;
  
  // Sezione 8: Note
  note_aggiuntive?: string;
  domande_al_trainer?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Misurazione {
  id: string;
  cliente_id: string;
  programma_id?: string;
  data_misurazione: string;
  fase_programma?: string;
  
  // Parametri Feelfit
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
  
  // Foto Pose
  foto_laterale_sx?: string;
  foto_laterale_dx?: string;
  foto_frontale_rilassato?: string;
  foto_posteriore_rilassato?: string;
  foto_frontale_doppio_bicipite?: string;
  foto_posteriore_lat_spread?: string;
  
  note?: string;
  created_at: string;
}

export interface Programma {
  id: string;
  cliente_id: string;
  anamnesi_id?: string;
  misurazione_iniziale_id?: string;
  
  nome: string;
  tipo: 'base' | 'periodizzato';
  stato: 'bozza' | 'attivo' | 'completato' | 'archiviato';
  
  data_inizio: string;
  data_fine?: string;
  
  // Contenuto programma (JSON)
  contenuto_json?: string;
  fase_corrente?: number;
  
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface SessioneAllenamento {
  id: string;
  programma_id: string;
  cliente_id: string;
  
  giorno_settimana: string;
  data_esecuzione?: string;
  completata: boolean;
  
  // Dati sessione (JSON con esercizi, carichi usati, ecc.)
  dati_json?: string;
  note?: string;
  
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form Types per Anamnesi
export interface AnamnesiFormData {
  // Tutte le sezioni del form
  [key: string]: string | number | boolean | string[] | undefined;
}

// Programma Generation Types
export interface GenerateProgrammaRequest {
  cliente_id: string;
  anamnesi_id: string;
  tipo_programma: 'base' | 'periodizzato';
  note_aggiuntive?: string;
}

export interface GenerateProgrammaResponse {
  programma_json: string;
  analisi: string;
  tabelle: string;
}
