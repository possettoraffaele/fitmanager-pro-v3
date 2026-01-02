-- =====================================================
-- FITMANAGER PRO v4.0 - FIX SCRIPT
-- =====================================================
-- Esegui questo script per correggere tabelle/colonne mancanti
-- =====================================================

-- Abilita UUID extension (se non già abilitata)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- VERIFICA E CREA TABELLE MANCANTI
-- =====================================================

-- TABELLA: clienti
CREATE TABLE IF NOT EXISTS clienti (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    data_nascita DATE,
    sesso VARCHAR(10),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELLA: anamnesi
CREATE TABLE IF NOT EXISTS anamnesi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    tipo_cliente VARCHAR(50),
    conclusione_ultimo_programma VARCHAR(50),
    durata_programma_precedente VARCHAR(50),
    efficacia_programma_voto INTEGER,
    aspetti_positivi TEXT,
    modifiche_desiderate TEXT,
    esercizi_problematici TEXT,
    risultati_ottenuti TEXT,
    cambiamenti_situazione TEXT,
    professione VARCHAR(200),
    altezza_cm INTEGER,
    peso_kg DECIMAL(5,2),
    forma_fisica_voto INTEGER,
    allenamenti_settimanali VARCHAR(20),
    allenamenti_facoltativi VARCHAR(20),
    giorni_fissi_specifici TEXT,
    giorni_facoltativi_specifici TEXT,
    durata_sessione VARCHAR(20),
    orario_allenamento VARCHAR(50),
    mobilita_pre BOOLEAN DEFAULT false,
    stretching_post BOOLEAN DEFAULT false,
    livello_esperienza VARCHAR(50),
    sport_passato VARCHAR(50),
    sport_passato_dettagli TEXT,
    sport_attuale VARCHAR(50),
    sport_attuale_dettagli TEXT,
    massimali_attuali TEXT,
    presenza_dolori VARCHAR(20),
    descrizione_dolori TEXT,
    storia_infortuni VARCHAR(50),
    dettagli_infortuni TEXT,
    patologie TEXT,
    altre_patologie TEXT,
    farmaci TEXT,
    qualita_sonno INTEGER,
    ore_sonno VARCHAR(20),
    livello_stress INTEGER,
    obiettivo_principale VARCHAR(100),
    obiettivo_secondario VARCHAR(100),
    obiettivi_specifici TEXT,
    tempistica_obiettivo VARCHAR(50),
    motivazione INTEGER,
    esercizi_preferiti TEXT,
    esercizi_evitare TEXT,
    focus_gruppi_muscolari TEXT,
    note_aggiuntive TEXT,
    domande_trainer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELLA: misurazioni
CREATE TABLE IF NOT EXISTS misurazioni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    programma_id UUID,
    data_misurazione DATE NOT NULL DEFAULT CURRENT_DATE,
    fase_programma VARCHAR(50),
    peso_kg DECIMAL(5,2) NOT NULL,
    grasso_percentuale DECIMAL(5,2),
    bmi DECIMAL(5,2),
    muscolo_scheletrico_percentuale DECIMAL(5,2),
    massa_muscolare_kg DECIMAL(5,2),
    proteine_percentuale DECIMAL(5,2),
    metabolismo_basale_kcal INTEGER,
    grasso_viscerale_livello INTEGER,
    idratazione_percentuale DECIMAL(5,2),
    massa_ossea_kg DECIMAL(5,2),
    eta_metabolica INTEGER,
    foto_fronte_rilassato VARCHAR(500),
    foto_fronte_contratto VARCHAR(500),
    foto_retro_rilassato VARCHAR(500),
    foto_retro_contratto VARCHAR(500),
    foto_lato_dx VARCHAR(500),
    foto_lato_sx VARCHAR(500),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELLA: programmi
CREATE TABLE IF NOT EXISTS programmi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    anamnesi_id UUID REFERENCES anamnesi(id) ON DELETE SET NULL,
    misurazione_iniziale_id UUID REFERENCES misurazioni(id) ON DELETE SET NULL,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'base',
    stato VARCHAR(20) DEFAULT 'bozza',
    data_inizio DATE,
    data_fine DATE,
    contenuto_json JSONB,
    fase_corrente INTEGER,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELLA: sessioni_allenamento
CREATE TABLE IF NOT EXISTS sessioni_allenamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programma_id UUID REFERENCES programmi(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    giorno_settimana VARCHAR(10),
    data_esecuzione DATE NOT NULL DEFAULT CURRENT_DATE,
    completata BOOLEAN DEFAULT false,
    dati_json JSONB,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREA INDEXES (solo se non esistono)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clienti_nome ON clienti(nome);
CREATE INDEX IF NOT EXISTS idx_clienti_cognome ON clienti(cognome);
CREATE INDEX IF NOT EXISTS idx_anamnesi_cliente ON anamnesi(cliente_id);
CREATE INDEX IF NOT EXISTS idx_misurazioni_cliente ON misurazioni(cliente_id);
CREATE INDEX IF NOT EXISTS idx_misurazioni_data ON misurazioni(data_misurazione DESC);
CREATE INDEX IF NOT EXISTS idx_programmi_cliente ON programmi(cliente_id);
CREATE INDEX IF NOT EXISTS idx_programmi_stato ON programmi(stato);
CREATE INDEX IF NOT EXISTS idx_sessioni_programma ON sessioni_allenamento(programma_id);
CREATE INDEX IF NOT EXISTS idx_sessioni_cliente ON sessioni_allenamento(cliente_id);
CREATE INDEX IF NOT EXISTS idx_sessioni_data ON sessioni_allenamento(data_esecuzione DESC);

-- =====================================================
-- ABILITA RLS E POLICY
-- =====================================================

ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesi ENABLE ROW LEVEL SECURITY;
ALTER TABLE misurazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmi ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessioni_allenamento ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Accesso pubblico clienti" ON clienti;
DROP POLICY IF EXISTS "Accesso pubblico anamnesi" ON anamnesi;
DROP POLICY IF EXISTS "Accesso pubblico misurazioni" ON misurazioni;
DROP POLICY IF EXISTS "Accesso pubblico programmi" ON programmi;
DROP POLICY IF EXISTS "Accesso pubblico sessioni" ON sessioni_allenamento;

-- Create policies
CREATE POLICY "Accesso pubblico clienti" ON clienti FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accesso pubblico anamnesi" ON anamnesi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accesso pubblico misurazioni" ON misurazioni FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accesso pubblico programmi" ON programmi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accesso pubblico sessioni" ON sessioni_allenamento FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- VERIFICA FINALE
-- =====================================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
