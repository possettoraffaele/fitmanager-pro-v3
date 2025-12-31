# 🏋️ FitManager Pro v3.0 

## ✨ Nuovo in v3.0

✅ **Gestione Misurazioni Bioimpedenziometriche**
- Peso, massa grassa %, massa muscolare %, acqua corporea %
- Circonferenze corporee complete  
- Plicometria e foto progresso
- Grafici trend evoluzione
- Comparazione misurazioni tra fasi programma

✅ **Tutti gli Errori Corretti**
- Nomi tabelle in italiano
- Error handling robusto
- Validazione completa
- Performance ottimizzate

✅ **Integrazione AI Potenziata**
- Dati biometrici inclusi nel prompt Claude
- Suggerimenti personalizzati basati su trend
- Adattamento programmi in base a risultati

---

## 🚀 Setup Rapido (da iPad/PC)

### 1. **Database Supabase**

```bash
# Vai su supabase.com/dashboard
# Crea nuovo progetto o usa esistente
# SQL Editor → New Query
# Copia e incolla tutto il contenuto di schema.sql
# Run
```

### 2. **GitHub (Nuovo Repository)**

```bash
# Opzione A: Da Working Copy (iPad)
1. Estrai l'archivio fitmanager-pro-v3.tar.gz
2. Working Copy → + → Import Repository
3. Seleziona la cartella estratta
4. Create new repository su GitHub
5. Push

# Opzione B: Da Browser
1. GitHub.com → New Repository → "fitmanager-pro-v3"
2. Upload tutti i file dalla cartella estratta
3. Commit
```

### 3. **Vercel (Nuovo Progetto)**

```bash
# Vai su vercel.com/dashboard
# New Project
# Import da GitHub → Seleziona "fitmanager-pro-v3"
# Framework Preset: Next.js
# Environment Variables → Aggiungi:
```

**Environment Variables Obbligatorie:**
```
NEXT_PUBLIC_SUPABASE_URL=https://koqfqraimwhambbbisnl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tua-chiave-da-supabase]
ANTHROPIC_API_KEY=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
APP_PASSWORD=ShakalakaA1.!
```

```bash
# Deploy!
```

---

## 📊 Nuove Funzionalità Bioimpedenziometria

### Tabella Misurazioni

La nuova tabella `misurazioni` include:

**Composizione Corporea:**
- Peso (kg)
- Massa grassa (%)
- Massa magra (kg)
- Massa muscolare (%)
- Acqua corporea (%)
- Metabolismo basale (kcal)

**Circonferenze (cm):**
- Petto, vita, fianchi
- Cosce (dx/sx)
- Braccia (dx/sx)
- Polpacci (dx/sx)

**Plicometria (mm):**
- Tricipitale
- Sottoscapolare
- Sovrailiaca
- Addominale

**Tracking:**
- Fase programma (PRE, FASE_1-4, POST)
- Note
- Foto progresso (fronte/lato/retro)
- Referto PDF

### API Endpoints

```typescript
// GET /api/misurazioni?cliente_id=xxx
// GET /api/misurazioni/[id]
// POST /api/misurazioni
// PUT /api/misurazioni/[id]
// DELETE /api/misurazioni/[id]
```

### Esempio Utilizzo

```typescript
// Creare misurazione
const nuovaMisurazione = {
  cliente_id: 'uuid-cliente',
  data_misurazione: '2025-01-15',
  fase_programma: 'PRE',
  peso_kg: 75.5,
  massa_grassa_perc: 18.5,
  circonferenza_vita_cm: 82,
  // ... altri campi
}

const res = await fetch('/api/misurazioni', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(nuovaMisurazione)
})
```

---

## 📁 Struttura Progetto

```
fitmanager-pro-v3/
├── app/
│   ├── auth/              # Login
│   ├── dashboard/         # Dashboard principale
│   │   ├── clients/       # Gestione clienti
│   │   ├── misurazioni/   # 🆕 Gestione misurazioni
│   │   ├── anamnesi/      # Anamnesi
│   │   ├── generate/      # Generazione AI programmi
│   │   └── programmi/     # Gestione programmi
│   ├── api/
│   │   ├── auth/          # Autenticazione
│   │   ├── clients/       # CRUD clienti
│   │   ├── misurazioni/   # 🆕 CRUD misurazioni
│   │   ├── anamnesi/      # CRUD anamnesi
│   │   ├── programmi/     # CRUD programmi
│   │   └── generate/      # Claude API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx
│       ├── StatsCard.tsx
│       └── MisurazioniChart.tsx  # 🆕 Grafici
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── claude-api.ts
├── types/
│   └── database.types.ts   # Include interfaccia Misurazione
├── schema.sql              # Schema completo con misurazioni
└── README.md
```

---

## 🔧 Estendere il Progetto

### Creare Pagina Misurazioni

```typescript
// app/dashboard/misurazioni/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Misurazione } from '@/types/database.types'

export default function MisurazioniPage() {
  const [misurazioni, setMisurazioni] = useState<Misurazione[]>([])
  
  useEffect(() => {
    loadMisurazioni()
  }, [])
  
  const loadMisurazioni = async () => {
    const res = await fetch('/api/misurazioni')
    const data = await res.json()
    setMisurazioni(Array.isArray(data) ? data : [])
  }
  
  return (
    <div>
      <h1>Misurazioni Bioimpedenziometriche</h1>
      {/* UI qui */}
    </div>
  )
}
```

### Grafici con Recharts

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

<LineChart width={600} height={300} data={misurazioni}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="data_misurazione" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="peso_kg" stroke="#3b82f6" name="Peso" />
  <Line type="monotone" dataKey="massa_grassa_perc" stroke="#ef4444" name="Massa Grassa %" />
</LineChart>
```

---

## ✅ Checklist Primo Avvio

- [ ] Database schema eseguito su Supabase
- [ ] Environment variables configurate su Vercel
- [ ] Repository GitHub creato e pushato
- [ ] Progetto Vercel collegato e deployato
- [ ] Login funzionante con password `ShakalakaA1.!`
- [ ] Dashboard accessibile
- [ ] Clienti CRUD funzionante
- [ ] API Misurazioni testata

---

## 🆘 Troubleshooting

### Errore 500 alle API
- Verifica environment variables su Vercel
- Controlla che le tabelle esistano su Supabase
- Redeploy dopo modifiche env vars

### Errore "relation does not exist"
- Esegui schema.sql su Supabase SQL Editor
- Verifica nomi tabelle (devono essere in italiano)

### Build fallito su Vercel
- Verifica che Framework Preset sia "Next.js"
- Output Directory deve essere VUOTO
- npm run build deve funzionare localmente

---

## 📞 Contatti

**Raffaele Possetto**  
Email: possettoraffaele2@gmail.com  
Telefono: 3757353820

---

**FitManager Pro v3.0** - Il tuo gestionale PT completo con AI! 💪
