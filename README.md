# 🏋️ FitManager Pro v4.0

Sistema completo di gestione clienti per personal trainer con generazione AI di programmi di allenamento.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Claude AI](https://img.shields.io/badge/Claude-AI-purple)

## ✨ Funzionalità

- **📋 Gestione Clienti**: CRUD completo con ricerca e filtri
- **📝 Anamnesi Psicofisica**: Form completo a 9 sezioni per raccolta dati cliente
- **📊 Misurazioni Bioimpedenziometriche**: Tracking parametri Feelfit (12 metriche)
- **🤖 Generazione AI**: Creazione programmi personalizzati con Claude AI
- **💪 Programmi**: Gestione schede base e periodizzate (4 fasi)
- **🎨 Design Professionale**: Tema blu, responsive, ottimizzato per iPad

## 🚀 Quick Start

### 1. Clona il repository

```bash
git clone https://github.com/tuousername/fitmanager-pro.git
cd fitmanager-pro
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura Supabase

1. Crea un nuovo progetto su [supabase.com](https://supabase.com)
2. Vai su **SQL Editor** e esegui il contenuto di `database-schema.sql`
3. Copia l'URL e la chiave Anon da **Settings > API**

### 4. Configura le variabili d'ambiente

Crea un file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
APP_PASSWORD=TuaPasswordSicura123!
```

### 5. Avvia in sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 📁 Struttura Progetto

```
fitmanager-pro-v4/
├── app/
│   ├── api/
│   │   ├── auth/route.ts         # Autenticazione
│   │   ├── clients/route.ts      # CRUD clienti
│   │   ├── anamnesi/route.ts     # CRUD anamnesi
│   │   ├── misurazioni/route.ts  # CRUD misurazioni
│   │   ├── programmi/route.ts    # CRUD programmi
│   │   └── generate/route.ts     # Generazione AI
│   ├── auth/page.tsx             # Login page
│   ├── dashboard/
│   │   ├── layout.tsx            # Layout con sidebar
│   │   ├── page.tsx              # Dashboard home
│   │   ├── clients/page.tsx      # Gestione clienti
│   │   ├── anamnesi/page.tsx     # Form anamnesi
│   │   ├── misurazioni/page.tsx  # Tracking misure
│   │   ├── programmi/page.tsx    # Lista programmi
│   │   └── generate/page.tsx     # Wizard AI
│   ├── globals.css               # Stili globali
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Redirect
├── components/
│   └── dashboard/
│       └── Sidebar.tsx           # Navigazione
├── lib/
│   ├── supabase.ts               # Client Supabase
│   └── prompts.ts                # Template AI
├── types/
│   └── database.types.ts         # TypeScript interfaces
├── database-schema.sql           # Schema Supabase
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔐 Autenticazione

L'app usa un sistema di autenticazione semplice basato su password:

1. La password è definita in `APP_PASSWORD`
2. Il login salva un token in localStorage
3. Le route dashboard sono protette

**Per produzione**: considera di implementare Supabase Auth per una gestione utenti completa.

## 🤖 Generazione AI

### Tipi di Programma

1. **Base**: Scheda singola per 4-12 settimane
2. **Periodizzato**: 4 fasi progressive (Adattamento → Ipertrofia → Forza → Peak)

### Flusso di Generazione

1. Seleziona cliente e anamnesi
2. Scegli tipo programma
3. Aggiungi istruzioni (opzionale)
4. Chatta con l'AI per raffinare
5. Copia JSON o salva nel database

### Template AI

I template (preamboli) sono in `/lib/prompts.ts` e contengono:
- Istruzioni metodologiche
- Struttura JSON richiesta
- Regole per serie speciali
- Gestione tempi allenamento

## 📊 Misurazioni Feelfit

Parametri tracciati dalla bilancia bioimpedenziometrica:

| Parametro | Unità |
|-----------|-------|
| Peso | kg |
| Grasso corporeo | % |
| BMI | - |
| Muscolo scheletrico | % |
| Massa muscolare | kg |
| Proteine | % |
| Metabolismo basale | kcal |
| Grasso viscerale | livello |
| Idratazione | % |
| Massa ossea | kg |
| Età metabolica | anni |

## 🚢 Deploy su Vercel

1. Push del repository su GitHub
2. Importa su [vercel.com](https://vercel.com)
3. Configura le variabili d'ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `APP_PASSWORD`
4. Deploy!

## 📱 Ottimizzazione Mobile

L'app è ottimizzata per iPad e dispositivi mobile:
- Layout responsive
- Touch-friendly
- Sidebar collassabile
- Form ottimizzati per touch

## 🛠️ Tecnologie

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Icons**: Lucide React
- **Charts**: Recharts (per grafici futuri)

## 📄 Licenza

Questo progetto è privato. Tutti i diritti riservati.

---

Sviluppato con ❤️ per Personal Trainer
