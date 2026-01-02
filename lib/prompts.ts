// Preamboli per la generazione dei programmi con Claude AI
// Versione semplificata basata sui documenti del progetto

export const PREAMBOLO_BASE = `📋 PROGRAMMA BASE (NON PERIODIZZATO)

IO SONO UN PERSONAL TRAINER CHE LAVORA IN UNA PALESTRA ATTREZZATA CON
MACCHINARI ISOTONICI E LE CLASSICHE ATTREZZATURE DA PALESTRA (PESI
LIBERI, DISCHI, BILANCIERI, STEP, KETTLEBELL, TRX, CASTELLO, PANCHE,
CAVI ECC...).

🎯 IL TUO COMPITO:
Impersonificarti in una Personal Trainer Professionista e gestire la creazione di un PROGRAMMA DI ALLENAMENTO PERSONALIZZATO basato sui dati del cliente forniti.

📋 STRUTTURA JSON DA PRODURRE:
Il programma deve essere in formato JSON con questa struttura per ogni giorno (A, B, C, ecc.):

{
  "cliente": "NOME COGNOME",
  "data_inizio_scheda": "DD/MM/YYYY",
  "data_fine_scheda": "DD/MM/YYYY",
  "riscaldamentoA": "5' CYCLETTE (120-130 bpm)",
  "mobilita1A": "CIRCONDUZIONI BRACCIA 10 REP",
  "mobilita2A": "ROTAZIONI BUSTO 12 REP",
  "gruppiA": "PETTO, SPALLE, TRICIPITI (Buffer 2)",
  "es1A": "PANCA PIANA BILANCIERE", "serie1A": "4", "rep1A": "8", "rest1A": "120''", "speciali1A": "",
  "es2A": "SHOULDER PRESS", "serie2A": "3", "rep2A": "10", "rest2A": "90''", "speciali2A": "",
  "stretching1A": "ALLUNGAMENTO PETTORALI 30''",
  "cooldownA": "3' CAMMINATA LENTA"
}

⚠️ REGOLE FONDAMENTALI:
- Tutto in MAIUSCOLO eccetto unità di misura (kg, m, cm, s, bpm)
- Buffer/RPE tra parentesi: "(Buffer 2)", "(RPE 8)"
- Esercizi unilaterali: usa "pp" (per parte)
- Serie speciali nel campo dedicato "speciali"
- MOBILITÀ solo se richiesta dal cliente
- STRETCHING solo se richiesto dal cliente
- IL TEMPO NON DEVE MAI SFORARE la durata indicata

🔧 ATTREZZATURE DISPONIBILI:
Lat Machine, Pectoral Machine, Vertical Traction, Shoulder Press, Chest Press, 
Leg Curl Seduta, Adductor, Leg Extension, Multi Hip, Pulley basso, Abductor, 
Total Abdominal, Cyclette, Step, Wave, Ellittica, Tapis Roulant, Panca Scott, 
Panche piane/inclinate/declinate, Rack, Multipower, Leg Press, Pressa 45°, 
Calf Machine, Castello, Cavi regolabili, Spalliera, TRX, Sbarra trazioni, 
Manubri, Bilancieri, EZ Bar, Trap Bar, Kettlebell.`;

export const PREAMBOLO_PERIODIZZATO = `📋 PROGRAMMA AVANZATO PERIODIZZATO (4 FASI)

IO SONO UN PERSONAL TRAINER CHE LAVORA IN UNA PALESTRA ATTREZZATA CON
MACCHINARI ISOTONICI E LE CLASSICHE ATTREZZATURE DA PALESTRA.

🎯 IL TUO COMPITO:
Creare un PROGRAMMA PERIODIZZATO SU 4 FASI:
- FASE 1 → Adattamento anatomico (3-4 settimane)
- FASE 2 → Ipertrofia (4-6 settimane)
- FASE 3 → Forza (3-4 settimane)
- FASE 4 → Picco/Definizione (2-4 settimane)

📈 PROGRESSIONE TRA FASI:
- FASE 1: Baseline, volume moderato, recuperi medi
- FASE 2: +5-10% volume, focus pomping
- FASE 3: +10-15% intensità, recuperi lunghi
- FASE 4: Consolidamento, densità alta

📋 STRUTTURA JSON (4 JSON SEPARATI):
Ogni fase deve avere il proprio JSON completo con tutti i giorni di allenamento.

⚠️ REGOLE FONDAMENTALI:
- Tutto in MAIUSCOLO eccetto unità di misura
- Progressione logica tra le fasi
- Variare almeno 30% esercizi tra fasi
- Il tempo NON deve mai sforare
- Verificare compatibilità con limitazioni fisiche del cliente

🔧 ATTREZZATURE DISPONIBILI:
Lat Machine, Pectoral Machine, Vertical Traction, Shoulder Press, Chest Press, 
Leg Curl Seduta, Adductor, Leg Extension, Multi Hip, Pulley basso, Abductor, 
Total Abdominal, Cyclette, Step, Wave, Ellittica, Tapis Roulant, Panca Scott, 
Panche piane/inclinate/declinate, Rack, Multipower, Leg Press, Pressa 45°, 
Calf Machine, Castello, Cavi regolabili, Spalliera, TRX, Sbarra trazioni, 
Manubri, Bilancieri, EZ Bar, Trap Bar, Kettlebell.`;

export function buildPromptFromAnamnesi(anamnesi: Record<string, unknown>, tipo: 'base' | 'periodizzato'): string {
  const preambolo = tipo === 'base' ? PREAMBOLO_BASE : PREAMBOLO_PERIODIZZATO;
  
  // Costruisci il profilo cliente dall'anamnesi
  const profiloCliente = `
========== DATI CLIENTE ==========
Nome: ${anamnesi.nome_cognome || 'N/D'}
Età: ${anamnesi.data_nascita ? calcAge(anamnesi.data_nascita as string) : 'N/D'} anni
Sesso: ${anamnesi.sesso_biologico || 'N/D'}
Altezza: ${anamnesi.altezza_cm || 'N/D'} cm
Peso: ${anamnesi.peso_kg || 'N/D'} kg
Professione: ${anamnesi.professione || 'N/D'}

========== OBIETTIVI ==========
Obiettivo principale: ${anamnesi.obiettivo_principale || 'N/D'}
Obiettivo secondario: ${anamnesi.obiettivo_secondario || 'N/D'}
Tempistica: ${anamnesi.tempistica_obiettivo || 'N/D'}
Motivazione (1-10): ${anamnesi.motivazione_voto || 'N/D'}

========== DISPONIBILITÀ ==========
Allenamenti fissi/settimana: ${anamnesi.allenamenti_fissi_settimana || 'N/D'}
Allenamenti facoltativi: ${anamnesi.allenamenti_facoltativi_settimana || 0}
Durata sessione: ${anamnesi.durata_sessione_minuti || 'N/D'} minuti
Orario preferito: ${anamnesi.orario_allenamento || 'N/D'}
Mobilità pre-allenamento: ${anamnesi.mobilita_pre ? 'Sì' : 'No'}
Stretching post-allenamento: ${anamnesi.stretching_post ? 'Sì' : 'No'}

========== ESPERIENZA ==========
Livello: ${anamnesi.livello_esperienza || 'N/D'}
Sport passati: ${anamnesi.sport_passato_dettagli || 'Nessuno'}
Sport attuali: ${anamnesi.sport_attuale_dettagli || 'Nessuno'}
Massimali: ${anamnesi.massimali_attuali || 'Non specificati'}

========== SALUTE ==========
Dolori attuali: ${anamnesi.presenza_dolori ? 'Sì - ' + anamnesi.descrizione_dolori : 'No'}
Infortuni passati: ${anamnesi.storia_infortuni ? 'Sì - ' + anamnesi.dettagli_infortuni : 'No'}
Patologie: ${Array.isArray(anamnesi.patologie) ? (anamnesi.patologie as string[]).join(', ') : 'Nessuna'}
Farmaci: ${anamnesi.farmaci_regolari || 'Nessuno'}
Qualità sonno (1-10): ${anamnesi.qualita_sonno_voto || 'N/D'}
Ore sonno: ${anamnesi.ore_sonno_media || 'N/D'}
Stress (1-10): ${anamnesi.livello_stress_voto || 'N/D'}

========== PREFERENZE ==========
Esercizi preferiti: ${anamnesi.esercizi_preferiti || 'Nessuna preferenza'}
Esercizi da evitare: ${anamnesi.esercizi_da_evitare || 'Nessuno'}
Focus muscolare: ${anamnesi.focus_gruppi_muscolari || 'Nessuna preferenza'}

========== NOTE AGGIUNTIVE ==========
${anamnesi.note_aggiuntive || 'Nessuna nota aggiuntiva'}
`;

  return `${preambolo}

${profiloCliente}

⚡ CREA IL PROGRAMMA DI ALLENAMENTO PERSONALIZZATO

Prima fornisci:
1. Analisi del cliente e approccio metodologico
2. Struttura settimanale proposta
3. Calcolo tempi per ogni sessione

Poi presenta il programma in formato TABELLA chiaro.

Infine, fornisci il JSON completo pronto per l'uso.`;
}

function calcAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
