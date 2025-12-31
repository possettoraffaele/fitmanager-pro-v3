-- ============================================
-- FITMANAGER PRO V3.1 - SCHEMA AGGIORNAMENTI
-- Aggiunte: Campi Feelfit completi + 6 Foto Pose
-- ============================================

-- STEP 1: Aggiorna tabella misurazioni con campi Feelfit mancanti
ALTER TABLE misurazioni 
ADD COLUMN IF NOT EXISTS bmi DECIMAL(4,1),
ADD COLUMN IF NOT EXISTS muscolo_scheletrico_perc DECIMAL(4,1),
ADD COLUMN IF NOT EXISTS massa_muscolare_kg DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS livello_capacita_stoccaggio INTEGER CHECK (livello_capacita_stoccaggio BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS proteine_perc DECIMAL(4,1),
ADD COLUMN IF NOT EXISTS grasso_addominale_livello INTEGER CHECK (grasso_addominale_livello BETWEEN 1 AND 15),
ADD COLUMN IF NOT EXISTS massa_ossea_kg DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS eta_metabolica INTEGER;

-- STEP 2: Aggiungi campi per le 6 foto pose
ALTER TABLE misurazioni
ADD COLUMN IF NOT EXISTS foto_laterale_sx_url TEXT,
ADD COLUMN IF NOT EXISTS foto_laterale_dx_url TEXT,
ADD COLUMN IF NOT EXISTS foto_frontale_rilassata_url TEXT,
ADD COLUMN IF NOT EXISTS foto_posteriore_rilassata_url TEXT,
ADD COLUMN IF NOT EXISTS foto_frontale_bicipite_url TEXT,
ADD COLUMN IF NOT EXISTS foto_posteriore_latspread_url TEXT;

-- STEP 3: Rimuovi campi foto vecchi (se non usati)
-- Commenta queste righe se preferisci mantenerli
-- ALTER TABLE misurazioni DROP COLUMN IF EXISTS foto_fronte_url;
-- ALTER TABLE misurazioni DROP COLUMN IF EXISTS foto_lato_url;
-- ALTER TABLE misurazioni DROP COLUMN IF EXISTS foto_retro_url;

-- STEP 4: Commento per chiarezza
COMMENT ON COLUMN misurazioni.bmi IS 'Body Mass Index calcolato automaticamente';
COMMENT ON COLUMN misurazioni.muscolo_scheletrico_perc IS 'Percentuale muscolo scheletrico da bioimpedenziometria';
COMMENT ON COLUMN misurazioni.massa_muscolare_kg IS 'Massa muscolare totale in kg';
COMMENT ON COLUMN misurazioni.livello_capacita_stoccaggio IS 'Livello capacità stoccaggio muscolare (1-10)';
COMMENT ON COLUMN misurazioni.proteine_perc IS 'Percentuale proteine corporee';
COMMENT ON COLUMN misurazioni.grasso_addominale_livello IS 'Livello grasso addominale (1-15)';
COMMENT ON COLUMN misurazioni.massa_ossea_kg IS 'Massa ossea in kg';
COMMENT ON COLUMN misurazioni.eta_metabolica IS 'Età metabolica calcolata';

COMMENT ON COLUMN misurazioni.foto_laterale_sx_url IS 'Foto laterale sinistra';
COMMENT ON COLUMN misurazioni.foto_laterale_dx_url IS 'Foto laterale destra';
COMMENT ON COLUMN misurazioni.foto_frontale_rilassata_url IS 'Foto frontale rilassata';
COMMENT ON COLUMN misurazioni.foto_posteriore_rilassata_url IS 'Foto posteriore rilassata';
COMMENT ON COLUMN misurazioni.foto_frontale_bicipite_url IS 'Foto frontale doppio bicipite';
COMMENT ON COLUMN misurazioni.foto_posteriore_latspread_url IS 'Foto posteriore latspread';

-- STEP 5: Funzione helper per calcolare BMI automaticamente
CREATE OR REPLACE FUNCTION calcola_bmi()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.peso_kg IS NOT NULL THEN
    -- BMI sarà calcolato dal frontend usando altezza da cliente
    -- Questo trigger è placeholder per future validazioni
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fine aggiornamenti
