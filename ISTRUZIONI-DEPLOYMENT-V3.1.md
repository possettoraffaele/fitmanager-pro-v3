# 🚀 DEPLOYMENT FITMANAGER PRO V3.1

## ✅ COSA È STATO AGGIORNATO

### 1. **Misurazioni** - Integrazione Completa Feelfit
- ✅ Tutti i 14 parametri bioimpedenziometrici
- ✅ Campi per 6 foto poses (laterali, frontale, posteriore, bicipite, latspread)
- ✅ Form aggiornato con tutti i campi visibili nell'app Feelfit
- ✅ Statistiche e visualizzazione migliorata

### 2. **Anamnesi** - Sezione Base
- ✅ Pagina placeholder pronta per integrazione form HTML completo
- ✅ Struttura database già presente (9 sezioni)
- 🔜 Integrazione form `Form_Anamnesi_Psicofisica.html` in arrivo

### 3. **Genera Programma AI** - Workflow Preview/Modifica/Conferma
- ✅ Selezione cliente
- ✅ Scelta tipo programma (Base/Periodizzato)
- ✅ Preview programma generato
- ✅ Possibilità modifica
- ✅ Conferma e salvataggio
- 🔜 Integrazione Claude API in arrivo

### 4. **Programmi** - Gestione Completa
- ✅ Lista programmi con filtri per stato
- ✅ Visualizzazione dettagli
- ✅ Stati: BOZZA → IN_REVISIONE → APPROVATO → ATTIVO → COMPLETATO
- 🔜 Export PDF e modifica in arrivo

### 5. **API Routes**
- ✅ `/api/misurazioni` (GET, POST)
- ✅ `/api/programmi` (GET, POST)
- ✅ Gestione errori migliorata

---

## 📊 STEP 1: AGGIORNA DATABASE SUPABASE

### **Opzione A: Da SQL Editor**

1. Vai su **Supabase Dashboard** → Il tuo progetto
2. **SQL Editor** nel menu laterale
3. Click **New Query**
4. Copia e incolla il contenuto di `schema-update-v3.1.sql`
5. Click **Run** (in basso a destra)
6. Verifica che non ci siano errori

### **Opzione B: Da Table Editor (Manuale)**

Se preferisci aggiungere colonne manualmente:

**Tabella: misurazioni**

Aggiungi queste colonne:
```
bmi                          → decimal(4,1)
muscolo_scheletrico_perc     → decimal(4,1)
massa_muscolare_kg           → decimal(5,2)
livello_capacita_stoccaggio  → integer (1-10)
proteine_perc                → decimal(4,1)
grasso_addominale_livello    → integer (1-15)
massa_ossea_kg               → decimal(4,2)
eta_metabolica               → integer
foto_laterale_sx_url         → text
foto_laterale_dx_url         → text
foto_frontale_rilassata_url  → text
foto_posteriore_rilassata_url → text
foto_frontale_bicipite_url   → text
foto_posteriore_latspread_url → text
```

---

## 🔄 STEP 2: UPLOAD PROGETTO SU GITHUB

### **Dal PC (Metodo Raccomandato)**

```bash
# 1. Estrai l'archivio fitmanager-pro-v3.1-COMPLETE.tar.gz

# 2. Apri terminale nella cartella estratta

# 3. Inizializza Git (se non già fatto)
git init

# 4. Aggiungi remote (sostituisci con il tuo repo)
git remote add origin https://github.com/TUO-USERNAME/fitmanager-pro-v3.git

# 5. Aggiungi tutti i file
git add .

# 6. Commit
git commit -m "v3.1: Misurazioni Feelfit complete + Anamnesi/Generate/Programmi"

# 7. Push
git push -u origin main
```

### **Da Browser (Working Copy - iPad)**

1. Estrai l'archivio su iPad
2. Apri **Working Copy**
3. Seleziona repository `fitmanager-pro-v3`
4. **Status** → **Stage All**
5. **Commit** con messaggio: "v3.1: Feelfit + nuove sezioni"
6. **Push** → **origin/main**

---

## ⚙️ STEP 3: VERIFICA ENVIRONMENT VARIABLES VERCEL

Assicurati che le 4 variabili siano impostate correttamente:

```
NEXT_PUBLIC_SUPABASE_URL = https://koqfqraimwhambbbisnl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY = sk-ant-api03-bfxBz9O9WQ5a...
APP_PASSWORD = ShakalakaA1.!
```

**IMPORTANTE:** Verifica che `NEXT_PUBLIC_SUPABASE_URL` sia **ESATTAMENTE**:
```
https://koqfqraimwhambbbisnl.supabase.co
```

(NON `suqYcsaiaHwn#00031i1.supabase.co` che era l'errore precedente!)

---

## 🚀 STEP 4: REDEPLOY SU VERCEL

1. **Vercel Dashboard** → `fitmanager-pro-v3`
2. **Deployments** → Deployment più recente
3. Click **⋯** → **Redeploy**
4. ❌ **NON spuntare** "Use existing Build Cache"
5. Click **Redeploy**
6. Aspetta 2-3 minuti

---

## ✅ STEP 5: TESTA LE NUOVE SEZIONI

### **Test Misurazioni**
1. Dashboard → **Misurazioni**
2. Click **Nuova Misurazione**
3. Compila form con dati Feelfit
4. Verifica salvataggio

### **Test Anamnesi**
1. Dashboard → **Anamnesi**
2. Verifica pagina caricata (placeholder)

### **Test Genera Programma**
1. Dashboard → **Genera Programma**
2. Seleziona cliente
3. Scegli tipo programma
4. Click **Genera** → Preview → Approva

### **Test Programmi**
1. Dashboard → **Programmi**
2. Verifica lista (vuota all'inizio)
3. Testa filtri per stato

---

## 📋 CHECKLIST COMPLETA

- [ ] Database aggiornato con nuove colonne (schema-update-v3.1.sql)
- [ ] Progetto uploadato su GitHub
- [ ] Environment variables verificate
- [ ] Redeploy senza cache
- [ ] Test Misurazioni OK
- [ ] Test Anamnesi OK
- [ ] Test Genera Programma OK
- [ ] Test Programmi OK

---

## 🆘 PROBLEMI COMUNI

### **500 Error su Misurazioni/Programmi**
→ Verifica che le colonne siano state aggiunte al database

### **"Column does not exist"**
→ Esegui di nuovo `schema-update-v3.1.sql`

### **Form non si apre**
→ Ctrl+F5 per refresh completo cache browser

### **Dati non si salvano**
→ Controlla console DevTools per errori API

---

## 🎯 PROSSIMI PASSI

1. **Integrazione Form Anamnesi HTML**
   - Parser Form_Anamnesi_Psicofisica.html
   - Salvataggio su database
   - Visualizzazione anamnesi compilate

2. **Integrazione Claude API**
   - Lettura preamboli (BASE/PERIODIZZATO)
   - Generazione programmi con AI
   - Preview/Modifica/Conferma workflow

3. **Upload Foto**
   - Storage Supabase per 6 foto poses
   - Compressione immagini
   - Confronto foto nel tempo

4. **Export PDF Programmi**
   - Template PDF personalizzabile
   - Export con logo
   - Invio email cliente

---

**VERSIONE:** v3.1
**DATA:** 31 Dicembre 2025
**STATO:** ✅ Pronto per deployment
