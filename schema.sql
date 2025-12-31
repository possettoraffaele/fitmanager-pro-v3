-- ============================================
-- FITMANAGER PRO V3.0 - DATABASE SCHEMA
-- Include: Clienti, Anamnesi, Programmi, Sessioni, MISURAZIONI
-- ============================================

-- Tabella Clienti
CREATE TABLE IF NOT EXISTS clienti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  cognome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefono VARCHAR(20),
  data_nascita DATE,
  sesso VARCHAR(1) CHECK (sesso IN ('M', 'F')),
  note TEXT,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Anamnesi (9 sezioni complete)
CREATE TABLE IF NOT EXISTS anamnesi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  compilato BOOLEAN DEFAULT false,
  
  -- Sezione 0: Tipo Cliente
  tipo_cliente VARCHAR(50),
  conclusione_ultimo_programma VARCHAR(100),
  durata_programma_precedente VARCHAR(100),
  efficacia_programma_voto INTEGER CHECK (efficacia_programma_voto BETWEEN 1 AND 10),
  aspetti_positivi TEXT[],
  modifiche_desiderate TEXT,
  esercizi_problematici TEXT,
  risultati_ottenuti TEXT,
  cambiamenti_situazione TEXT,
  
  -- Sezione 1: Dati Personali
  altezza_cm INTEGER,
  peso_kg DECIMAL(5,2),
  professione VARCHAR(255),
  
  -- Sezione 2: Caratteristiche Fisiche
  forma_fisica_voto INTEGER CHECK (forma_fisica_voto BETWEEN 1 AND 10),
  
  -- Sezione 3: Modalità Allenamento
  allenamenti_fissi_settimana INTEGER,
  allenamenti_facoltativi_settimana INTEGER,
  giorni_fissi_specifici TEXT[],
  giorni_facoltativi_specifici TEXT[],
  durata_sessione_minuti INTEGER,
  orario_allenamento VARCHAR(100),
  
  -- Sezione 4: Esperienza Sportiva
  livello_esperienza VARCHAR(100),
  sport_passato BOOLEAN,
  sport_passato_dettagli TEXT,
  sport_attuale BOOLEAN,
  sport_attuale_dettagli TEXT,
  massimali_attuali TEXT,
  
  -- Sezione 5: Salute e Benessere
  presenza_dolori BOOLEAN,
  descrizione_dolori TEXT,
  storia_infortuni BOOLEAN,
  dettagli_infortuni TEXT,
  patologie TEXT[],
  altre_patologie_dettagli TEXT,
  farmaci_regolari TEXT,
  qualita_sonno_voto INTEGER CHECK (qualita_sonno_voto BETWEEN 1 AND 10),
  ore_sonno_media VARCHAR(50),
  livello_stress_voto INTEGER CHECK (livello_stress_voto BETWEEN 1 AND 10),
  
  -- Sezione 6: Obiettivi
  obiettivo_principale VARCHAR(255),
  obiettivo_secondario VARCHAR(255),
  obiettivi_specifici_dettagli TEXT,
  tempistica_obiettivo VARCHAR(100),
  motivazione_voto INTEGER CHECK (motivazione_voto BETWEEN 1 AND 10),
  
  -- Sezione 7: Preferenze
  esercizi_preferiti TEXT,
  esercizi_da_evitare TEXT,
  focus_gruppi_muscolari TEXT,
  
  -- Sezione 8: Note Aggiuntive
  note_aggiuntive TEXT,
  domande_al_trainer TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🆕 Tabella Misurazioni Bioimpedenziometriche
CREATE TABLE IF NOT EXISTS misurazioni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
  programma_id UUID REFERENCES programmi(id) ON DELETE SET NULL,
  
  -- Data e Fase
  data_misurazione DATE NOT NULL DEFAULT CURRENT_DATE,
  fase_programma VARCHAR(50), -- 'PRE', 'FASE_1', 'FASE_2', 'FASE_3', 'FASE_4', 'POST'
  
  -- Peso e Composizione Corporea
  peso_kg DECIMAL(5,2) NOT NULL,
  massa_grassa_perc DECIMAL(4,1),
  massa_magra_kg DECIMAL(5,2),
  massa_muscolare_perc DECIMAL(4,1),
  acqua_corporea_perc DECIMAL(4,1),
  metabolismo_basale_kcal INTEGER,
  
  -- Circonferenze (cm)
  circonferenza_petto_cm DECIMAL(5,2),
  circonferenza_vita_cm DECIMAL(5,2),
  circonferenza_fianchi_cm DECIMAL(5,2),
  circonferenza_coscia_dx_cm DECIMAL(5,2),
  circonferenza_coscia_sx_cm DECIMAL(5,2),
  circonferenza_braccio_dx_cm DECIMAL(5,2),
  circonferenza_braccio_sx_cm DECIMAL(5,2),
  circonferenza_polpaccio_dx_cm DECIMAL(5,2),
  circonferenza_polpaccio_sx_cm DECIMAL(5,2),
  
  -- Plicometria (mm)
  plica_tricipitale_mm DECIMAL(4,1),
  plica_sottoscapolare_mm DECIMAL(4,1),
  plica_sovrailiaca_mm DECIMAL(4,1),
  plica_addominale_mm DECIMAL(4,1),
  
  -- Note e Allegati
  note TEXT,
  foto_fronte_url TEXT,
  foto_lato_url TEXT,
  foto_retro_url TEXT,
  referto_pdf_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Programmi
CREATE TABLE IF NOT EXISTS programmi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
  anamnesi_id UUID REFERENCES anamnesi(id) ON DELETE SET NULL,
  misurazione_iniziale_id UUID REFERENCES misurazioni(id) ON DELETE SET NULL,
  
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('BASE', 'PERIODIZZATO')),
  stato VARCHAR(50) DEFAULT 'BOZZA' CHECK (stato IN ('BOZZA', 'IN_REVISIONE', 'APPROVATO', 'ATTIVO', 'COMPLETATO')),
  
  -- AI Generation
  prompt_generato TEXT,
  risposta_ai TEXT,
  richieste_modifica TEXT[],
  
  -- Struttura Programma
  struttura JSONB,
  
  -- Date
  data_inizio DATE,
  data_fine DATE,
  data_prevista_pesata DATE, -- 🆕 Per alert pesate
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Sessioni Allenamento
CREATE TABLE IF NOT EXISTS sessioni_allenamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programma_id UUID REFERENCES programmi(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
  
  giorno VARCHAR(10),
  data_completamento TIMESTAMP WITH TIME ZONE,
  
  esercizi_completati JSONB,
  pesi_utilizzati JSONB,
  note TEXT,
  durata_minuti INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per Performance
CREATE INDEX IF NOT EXISTS idx_clienti_email ON clienti(email);
CREATE INDEX IF NOT EXISTS idx_clienti_attivo ON clienti(attivo);
CREATE INDEX IF NOT EXISTS idx_anamnesi_cliente ON anamnesi(cliente_id);
CREATE INDEX IF NOT EXISTS idx_anamnesi_token ON anamnesi(token);
CREATE INDEX IF NOT EXISTS idx_misurazioni_cliente ON misurazioni(cliente_id);
CREATE INDEX IF NOT EXISTS idx_misurazioni_programma ON misurazioni(programma_id);
CREATE INDEX IF NOT EXISTS idx_misurazioni_data ON misurazioni(data_misurazione DESC);
CREATE INDEX IF NOT EXISTS idx_programmi_cliente ON programmi(cliente_id);
CREATE INDEX IF NOT EXISTS idx_programmi_stato ON programmi(stato);
CREATE INDEX IF NOT EXISTS idx_sessioni_programma ON sessioni_allenamento(programma_id);
CREATE INDEX IF NOT EXISTS idx_sessioni_cliente ON sessioni_allenamento(cliente_id);

-- Row Level Security
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesi ENABLE ROW LEVEL SECURITY;
ALTER TABLE misurazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmi ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessioni_allenamento ENABLE ROW LEVEL SECURITY;

-- Policy Permissive (per sviluppo - da restringere in produzione)
CREATE POLICY "Allow all for clienti" ON clienti FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anamnesi" ON anamnesi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for misurazioni" ON misurazioni FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for programmi" ON programmi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for sessioni" ON sessioni_allenamento FOR ALL USING (true) WITH CHECK (true);

-- Funzioni Utility
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per auto-update updated_at
CREATE TRIGGER update_clienti_updated_at BEFORE UPDATE ON clienti FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_anamnesi_updated_at BEFORE UPDATE ON anamnesi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_misurazioni_updated_at BEFORE UPDATE ON misurazioni FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programmi_updated_at BEFORE UPDATE ON programmi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fine Schema
