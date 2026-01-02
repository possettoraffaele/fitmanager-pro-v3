-- =====================================================
-- FITMANAGER PRO v4.0 - SCHEMA DATABASE SUPABASE
-- =====================================================
-- Esegui questo script nel SQL Editor di Supabase
-- per creare tutte le tabelle necessarie.
-- =====================================================

-- Abilita UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELLA: clienti
-- Informazioni base dei clienti
-- =====================================================
CREATE TABLE IF NOT EXISTS clienti (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    data_nascita DATE,
    sesso VARCHAR(10) CHECK (sesso IN ('Maschio', 'Femmina', 'Altro')),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index per ricerche
CREATE INDEX IF NOT EXISTS idx_clienti_nome ON clienti(nome);
CREATE INDEX IF NOT EXISTS idx_clienti_cognome ON clienti(cognome);
CREATE INDEX IF NOT EXISTS idx_clienti_email ON clienti(email);

-- =====================================================
-- TABELLA: anamnesi
-- Questionario completo psicofisico
-- =====================================================
CREATE TABLE IF NOT EXISTS anamnesi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    
    -- Sezione 0: Tipo Cliente
    tipo_cliente VARCHAR(50), -- 'Nuovo_Cliente' o 'Cliente_Ricorrente'
    conclusione_ultimo_programma VARCHAR(50),
    durata_programma_precedente VARCHAR(50),
    efficacia_programma_voto INTEGER CHECK (efficacia_programma_voto BETWEEN 1 AND 10),
    aspetti_positivi TEXT,
    modifiche_desiderate TEXT,
    esercizi_problematici TEXT,
    risultati_ottenuti TEXT,
    cambiamenti_situazione TEXT,
    
    -- Sezione 1: Informazioni Personali (alcuni dati sono nel cliente)
    professione VARCHAR(200),
    
    -- Sezione 2: Caratteristiche Fisiche
    altezza_cm INTEGER,
    peso_kg DECIMAL(5,2),
    forma_fisica_voto INTEGER CHECK (forma_fisica_voto BETWEEN 1 AND 10),
    
    -- Sezione 3: Modalità Allenamento
    allenamenti_settimanali VARCHAR(20), -- '0_fissi', '1_fisso', etc.
    allenamenti_facoltativi VARCHAR(20),
    giorni_fissi_specifici TEXT, -- JSON array o stringa separata da virgole
    giorni_facoltativi_specifici TEXT,
    durata_sessione VARCHAR(20), -- '30_minuti', '45_minuti', etc.
    orario_allenamento VARCHAR(50),
    mobilita_pre BOOLEAN DEFAULT false,
    stretching_post BOOLEAN DEFAULT false,
    
    -- Sezione 4: Esperienza Sportiva
    livello_esperienza VARCHAR(50), -- 'Principiante_0-6_mesi', etc.
    sport_passato VARCHAR(50), -- 'Si_sport_passato' o 'No_sport_passato'
    sport_passato_dettagli TEXT,
    sport_attuale VARCHAR(50),
    sport_attuale_dettagli TEXT,
    massimali_attuali TEXT,
    
    -- Sezione 5: Salute e Benessere
    presenza_dolori VARCHAR(20), -- 'Si_dolori' o 'No_dolori'
    descrizione_dolori TEXT,
    storia_infortuni VARCHAR(50),
    dettagli_infortuni TEXT,
    patologie TEXT, -- JSON array o stringa separata da virgole
    altre_patologie TEXT,
    farmaci TEXT,
    qualita_sonno INTEGER CHECK (qualita_sonno BETWEEN 1 AND 10),
    ore_sonno VARCHAR(20),
    livello_stress INTEGER CHECK (livello_stress BETWEEN 1 AND 10),
    
    -- Sezione 6: Obiettivi
    obiettivo_principale VARCHAR(100),
    obiettivo_secondario VARCHAR(100),
    obiettivi_specifici TEXT,
    tempistica_obiettivo VARCHAR(50),
    motivazione INTEGER CHECK (motivazione BETWEEN 1 AND 10),
    
    -- Sezione 7: Preferenze
    esercizi_preferiti TEXT,
    esercizi_evitare TEXT,
    focus_gruppi_muscolari TEXT,
    
    -- Sezione 8: Note
    note_aggiuntive TEXT,
    domande_trainer TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anamnesi_cliente ON anamnesi(cliente_id);
CREATE INDEX IF NOT EXISTS idx_anamnesi_created ON anamnesi(created_at DESC);

-- =====================================================
-- TABELLA: misurazioni
-- Dati bioimpedenziometrici e foto progressi
-- =====================================================
CREATE TABLE IF NOT EXISTS misurazioni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    programma_id UUID, -- Collegamento opzionale al programma
    
    -- Data e fase
    data_misurazione DATE NOT NULL DEFAULT CURRENT_DATE,
    fase_programma VARCHAR(50), -- 'Fase 1', 'Fase 2', etc.
    
    -- Parametri Feelfit Bioimpedenza
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
    
    -- Foto progressi (URL storage Supabase)
    foto_fronte_rilassato VARCHAR(500),
    foto_fronte_contratto VARCHAR(500),
    foto_retro_rilassato VARCHAR(500),
    foto_retro_contratto VARCHAR(500),
    foto_lato_dx VARCHAR(500),
    foto_lato_sx VARCHAR(500),
    
    -- Note
    note TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_misurazioni_cliente ON misurazioni(cliente_id);
CREATE INDEX IF NOT EXISTS idx_misurazioni_data ON misurazioni(data_misurazione DESC);
CREATE INDEX IF NOT EXISTS idx_misurazioni_programma ON misurazioni(programma_id);

-- =====================================================
-- TABELLA: programmi
-- Programmi di allenamento generati
-- =====================================================
CREATE TABLE IF NOT EXISTS programmi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    anamnesi_id UUID REFERENCES anamnesi(id) ON DELETE SET NULL,
    misurazione_iniziale_id UUID REFERENCES misurazioni(id) ON DELETE SET NULL,
    
    -- Info programma
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('base', 'periodizzato')) DEFAULT 'base',
    stato VARCHAR(20) CHECK (stato IN ('bozza', 'attivo', 'completato', 'archiviato')) DEFAULT 'bozza',
    
    -- Date
    data_inizio DATE,
    data_fine DATE,
    
    -- Contenuto JSON del programma
    contenuto_json JSONB,
    
    -- Per programmi periodizzati
    fase_corrente INTEGER CHECK (fase_corrente BETWEEN 1 AND 4),
    
    -- Note
    note TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_programmi_cliente ON programmi(cliente_id);
CREATE INDEX IF NOT EXISTS idx_programmi_stato ON programmi(stato);
CREATE INDEX IF NOT EXISTS idx_programmi_tipo ON programmi(tipo);
CREATE INDEX IF NOT EXISTS idx_programmi_created ON programmi(created_at DESC);

-- =====================================================
-- TABELLA: sessioni_allenamento
-- Tracking delle sessioni eseguite
-- =====================================================
CREATE TABLE IF NOT EXISTS sessioni_allenamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programma_id UUID REFERENCES programmi(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
    
    -- Info sessione
    giorno_settimana VARCHAR(10), -- 'A', 'B', 'C', etc.
    data_esecuzione DATE NOT NULL DEFAULT CURRENT_DATE,
    completata BOOLEAN DEFAULT false,
    
    -- Dati sessione (carichi, note, RPE, etc.)
    dati_json JSONB,
    
    -- Note
    note TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessioni_programma ON sessioni_allenamento(programma_id);
CREATE INDEX IF NOT EXISTS idx_sessioni_cliente ON sessioni_allenamento(cliente_id);
CREATE INDEX IF NOT EXISTS idx_sessioni_data ON sessioni_allenamento(data_esecuzione DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Abilita RLS su tutte le tabelle
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesi ENABLE ROW LEVEL SECURITY;
ALTER TABLE misurazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmi ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessioni_allenamento ENABLE ROW LEVEL SECURITY;

-- Policy per accesso anonimo (per app con auth semplice)
-- In produzione, considera di usare Supabase Auth e policy più restrittive

CREATE POLICY "Accesso pubblico clienti" ON clienti
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accesso pubblico anamnesi" ON anamnesi
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accesso pubblico misurazioni" ON misurazioni
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accesso pubblico programmi" ON programmi
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accesso pubblico sessioni" ON sessioni_allenamento
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- TRIGGER per updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clienti_updated_at
    BEFORE UPDATE ON clienti
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_anamnesi_updated_at
    BEFORE UPDATE ON anamnesi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programmi_updated_at
    BEFORE UPDATE ON programmi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATI DI ESEMPIO (opzionale - decommenta per test)
-- =====================================================

/*
-- Inserisci un cliente di esempio
INSERT INTO clienti (nome, cognome, email, telefono, data_nascita, sesso)
VALUES ('Mario', 'Rossi', 'mario.rossi@email.com', '3331234567', '1990-05-15', 'Maschio');

-- Inserisci un'anamnesi di esempio
INSERT INTO anamnesi (
    cliente_id,
    tipo_cliente,
    professione,
    altezza_cm,
    peso_kg,
    forma_fisica_voto,
    allenamenti_settimanali,
    durata_sessione,
    orario_allenamento,
    livello_esperienza,
    presenza_dolori,
    qualita_sonno,
    livello_stress,
    obiettivo_principale,
    tempistica_obiettivo,
    motivazione
)
SELECT 
    id,
    'Nuovo_Cliente',
    'Impiegato',
    175,
    80.0,
    5,
    '3_fissi',
    '60_minuti',
    'Serale_18:00-22:00',
    'Intermedio_1-3_anni',
    'No_dolori',
    7,
    5,
    'Aumento_massa_muscolare',
    '3_mesi',
    8
FROM clienti WHERE email = 'mario.rossi@email.com';
*/

-- =====================================================
-- VERIFICA CREAZIONE TABELLE
-- =====================================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
