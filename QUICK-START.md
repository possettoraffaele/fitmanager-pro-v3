# 🚀 Quick Start - FitManager Pro v3.0

## Setup in 5 Minuti

### 1. Database (2 min)
```
1. supabase.com → Dashboard → SQL Editor
2. Copia TUTTO il contenuto di schema.sql
3. Incolla e Run
4. Verifica tabelle create: clienti, anamnesi, misurazioni, programmi, sessioni_allenamento
```

### 2. GitHub (1 min)
```
1. github.com → New repository → "fitmanager-pro-v3"
2. Upload tutti i file dall'archivio estratto
3. Commit "Initial commit"
```

### 3. Vercel (2 min)
```
1. vercel.com → New Project
2. Import da GitHub
3. Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - ANTHROPIC_API_KEY
   - APP_PASSWORD
4. Deploy!
```

### 4. Test
```
1. Apri URL Vercel
2. Login: ShakalakaA1.!
3. Dashboard → Clienti → Nuovo Cliente
4. FUNZIONA! ✅
```

## 🆕 Test Misurazioni

```
1. Dashboard → Misurazioni (nuova voce menu)
2. Nuova Misurazione
3. Seleziona cliente
4. Inserisci peso e dati
5. Salva
6. Vedi grafici trend!
```

## ⚡ Problema?

### Errore 500
→ Verifica env vars su Vercel
→ Redeploy dopo aggiunte

### Tabelle mancanti
→ Riesegui schema.sql

### Build Error
→ Framework = Next.js
→ Output Directory = VUOTO

---

✅ In 5 minuti hai FitManager Pro v3.0 funzionante con bioimpedenziometria!
