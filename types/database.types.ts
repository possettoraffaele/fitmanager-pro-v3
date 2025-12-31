export interface Cliente {
  id: string
  nome: string
  cognome: string
  email?: string
  telefono?: string
  data_nascita?: string
  sesso?: 'M' | 'F'
  note?: string
  attivo: boolean
  created_at: string
  updated_at: string
}

export interface Anamnesi {
  id: string
  cliente_id: string
  token: string
  compilato: boolean
  
  // Sezione 0
  tipo_cliente?: string
  conclusione_ultimo_programma?: string
  durata_programma_precedente?: string
  efficacia_programma_voto?: number
  aspetti_positivi?: string[]
  modifiche_desiderate?: string
  esercizi_problematici?: string
  risultati_ottenuti?: string
  cambiamenti_situazione?: string
  
  // Sezione 1
  altezza_cm?: number
  peso_kg?: number
  professione?: string
  
  // Sezione 2
  forma_fisica_voto?: number
  
  // Sezione 3
  allenamenti_fissi_settimana?: number
  allenamenti_facoltativi_settimana?: number
  giorni_fissi_specifici?: string[]
  giorni_facoltativi_specifici?: string[]
  durata_sessione_minuti?: number
  orario_allenamento?: string
  
  // Sezione 4
  livello_esperienza?: string
  sport_passato?: boolean
  sport_passato_dettagli?: string
  sport_attuale?: boolean
  sport_attuale_dettagli?: string
  massimali_attuali?: string
  
  // Sezione 5
  presenza_dolori?: boolean
  descrizione_dolori?: string
  storia_infortuni?: boolean
  dettagli_infortuni?: string
  patologie?: string[]
  altre_patologie_dettagli?: string
  farmaci_regolari?: string
  qualita_sonno_voto?: number
  ore_sonno_media?: string
  livello_stress_voto?: number
  
  // Sezione 6
  obiettivo_principale?: string
  obiettivo_secondario?: string
  obiettivi_specifici_dettagli?: string
  tempistica_obiettivo?: string
  motivazione_voto?: number
  
  // Sezione 7
  esercizi_preferiti?: string
  esercizi_da_evitare?: string
  focus_gruppi_muscolari?: string
  
  // Sezione 8
  note_aggiuntive?: string
  domande_al_trainer?: string
  
  created_at: string
  updated_at: string
}

// 🆕 Interfaccia Misurazione Bioimpedenziometrica - COMPLETA FEELFIT
export interface Misurazione {
  id: string
  cliente_id: string
  programma_id?: string
  
  // Data e Fase
  data_misurazione: string
  fase_programma?: 'PRE' | 'FASE_1' | 'FASE_2' | 'FASE_3' | 'FASE_4' | 'POST'
  
  // Peso e Composizione Corporea (Feelfit)
  peso_kg: number
  massa_grassa_perc?: number
  massa_magra_kg?: number
  massa_muscolare_perc?: number
  massa_muscolare_kg?: number
  muscolo_scheletrico_perc?: number
  acqua_corporea_perc?: number
  metabolismo_basale_kcal?: number
  bmi?: number
  livello_capacita_stoccaggio?: number
  proteine_perc?: number
  grasso_addominale_livello?: number
  massa_ossea_kg?: number
  eta_metabolica?: number
  
  // Circonferenze (cm)
  circonferenza_petto_cm?: number
  circonferenza_vita_cm?: number
  circonferenza_fianchi_cm?: number
  circonferenza_coscia_dx_cm?: number
  circonferenza_coscia_sx_cm?: number
  circonferenza_braccio_dx_cm?: number
  circonferenza_braccio_sx_cm?: number
  circonferenza_polpaccio_dx_cm?: number
  circonferenza_polpaccio_sx_cm?: number
  
  // Plicometria (mm)
  plica_tricipitale_mm?: number
  plica_sottoscapolare_mm?: number
  plica_sovrailiaca_mm?: number
  plica_addominale_mm?: number
  
  // Foto Poses (6 foto bodybuilding standard)
  foto_laterale_sx_url?: string
  foto_laterale_dx_url?: string
  foto_frontale_rilassata_url?: string
  foto_posteriore_rilassata_url?: string
  foto_frontale_bicipite_url?: string
  foto_posteriore_latspread_url?: string
  
  // Note e Allegati
  note?: string
  referto_pdf_url?: string
  
  created_at: string
  updated_at: string
}

export interface Programma {
  id: string
  cliente_id: string
  anamnesi_id?: string
  misurazione_iniziale_id?: string
  
  tipo: 'BASE' | 'PERIODIZZATO'
  stato: 'BOZZA' | 'IN_REVISIONE' | 'APPROVATO' | 'ATTIVO' | 'COMPLETATO'
  
  prompt_generato?: string
  risposta_ai?: string
  richieste_modifica?: string[]
  
  struttura?: any
  
  data_inizio?: string
  data_fine?: string
  data_prevista_pesata?: string
  
  created_at: string
  updated_at: string
}

export interface SessioneAllenamento {
  id: string
  programma_id: string
  cliente_id: string
  
  giorno: string
  data_completamento?: string
  
  esercizi_completati?: any
  pesi_utilizzati?: any
  note?: string
  durata_minuti?: number
  
  created_at: string
}

// Helper Types
export interface MisurazioneConCliente extends Misurazione {
  cliente: Cliente
}

export interface ProgrammaConRelazioni extends Programma {
  cliente: Cliente
  anamnesi?: Anamnesi
  misurazione_iniziale?: Misurazione
}
