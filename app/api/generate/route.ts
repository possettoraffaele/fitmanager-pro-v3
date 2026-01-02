import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { PREAMBOLO_BASE, PREAMBOLO_PERIODIZZATO } from '@/lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cliente_id, 
      anamnesi_id, 
      tipo_programma, // 'base' o 'periodizzato'
      istruzioni_aggiuntive,
      programmi_precedenti 
    } = body;

    // Validate required fields
    if (!cliente_id || !anamnesi_id || !tipo_programma) {
      return NextResponse.json(
        { error: 'cliente_id, anamnesi_id e tipo_programma sono obbligatori' },
        { status: 400 }
      );
    }

    // Fetch client data
    const { data: cliente, error: clienteError } = await supabase
      .from('clienti')
      .select('*')
      .eq('id', cliente_id)
      .single();

    if (clienteError || !cliente) {
      return NextResponse.json(
        { error: 'Cliente non trovato' },
        { status: 404 }
      );
    }

    // Fetch anamnesi data
    const { data: anamnesi, error: anamnesiError } = await supabase
      .from('anamnesi')
      .select('*')
      .eq('id', anamnesi_id)
      .single();

    if (anamnesiError || !anamnesi) {
      return NextResponse.json(
        { error: 'Anamnesi non trovata' },
        { status: 404 }
      );
    }

    // Fetch latest measurement if exists
    const { data: misurazione } = await supabase
      .from('misurazioni')
      .select('*')
      .eq('cliente_id', cliente_id)
      .order('data_misurazione', { ascending: false })
      .limit(1)
      .single();

    // Build the complete prompt
    const preambolo = tipo_programma === 'periodizzato' 
      ? PREAMBOLO_PERIODIZZATO 
      : PREAMBOLO_BASE;

    // Format anamnesi data for the AI
    const anamnesiFormattata = formatAnamnesiForAI(anamnesi, cliente, misurazione);

    // Build conversation messages
    const messages: any[] = [
      {
        role: 'user',
        content: `${preambolo}

---

ANAMNESI DEL CLIENTE:

${anamnesiFormattata}

${programmi_precedenti ? `
PROGRAMMI PRECEDENTI DEL CLIENTE:
${programmi_precedenti}
` : ''}

${istruzioni_aggiuntive ? `
ISTRUZIONI AGGIUNTIVE DEL TRAINER:
${istruzioni_aggiuntive}
` : ''}

Per favore analizza questi dati e prepara il programma di allenamento.`
      }
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: messages,
    });

    // Extract the response content
    const aiResponse = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    return NextResponse.json({
      success: true,
      risposta: aiResponse,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        cognome: cliente.cognome,
      },
      anamnesi_id: anamnesi.id,
      tipo_programma,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      }
    });

  } catch (error: any) {
    console.error('Error generating program:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nella generazione del programma' },
      { status: 500 }
    );
  }
}

function formatAnamnesiForAI(anamnesi: any, cliente: any, misurazione: any): string {
  const calcAge = (birthDate: string) => {
    if (!birthDate) return 'N/D';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  let output = `========== DATI PERSONALI ==========
- 01_DATI_nome: ${cliente.nome || 'N/D'}
- 01_DATI_cognome: ${cliente.cognome || 'N/D'}
- 01_DATI_eta: ${calcAge(cliente.data_nascita)}
- 01_DATI_sesso: ${cliente.sesso || 'N/D'}
- 01_DATI_altezza_cm: ${anamnesi.altezza_cm || 'N/D'}
- 01_DATI_peso_kg: ${misurazione?.peso_kg || anamnesi.peso_kg || 'N/D'}
- 01_DATI_professione: ${anamnesi.professione || 'N/D'}
- 01_DATI_telefono: ${cliente.telefono || 'N/D'}

========== OBIETTIVI ==========
- 02_OBIETTIVI_principale: ${anamnesi.obiettivo_principale || 'N/D'}
- 02_OBIETTIVI_secondari: ${anamnesi.obiettivo_secondario || 'N/D'}
- 02_OBIETTIVI_specifici: ${anamnesi.obiettivi_specifici || 'N/D'}
- 02_OBIETTIVI_tempistica: ${anamnesi.tempistica_obiettivo || 'N/D'}
- 02_OBIETTIVI_motivazione: ${anamnesi.motivazione || 'N/D'}

========== ESPERIENZA ==========
- 03_ESPERIENZA_livello: ${anamnesi.livello_esperienza || 'N/D'}
- 03_ESPERIENZA_sport_passato: ${anamnesi.sport_passato || 'N/D'}
- 03_ESPERIENZA_sport_passato_dettagli: ${anamnesi.sport_passato_dettagli || 'N/D'}
- 03_ESPERIENZA_sport_attuale: ${anamnesi.sport_attuale || 'N/D'}
- 03_ESPERIENZA_sport_attuale_dettagli: ${anamnesi.sport_attuale_dettagli || 'N/D'}
- 03_ESPERIENZA_massimali: ${anamnesi.massimali_attuali || 'N/D'}

========== DISPONIBILITÀ ==========
- 04_DISPONIBILITA_giorni_garantiti: ${anamnesi.allenamenti_settimanali || 'N/D'}
- 04_DISPONIBILITA_giorni_extra: ${anamnesi.allenamenti_facoltativi || '0'}
- 04_DISPONIBILITA_giorni_specifici: ${anamnesi.giorni_fissi_specifici || 'N/D'}
- 04_DISPONIBILITA_durata: ${anamnesi.durata_sessione || 'N/D'}
- 04_DISPONIBILITA_orari: ${anamnesi.orario_allenamento || 'N/D'}
- 04_DISPONIBILITA_mobilita_pre: ${anamnesi.mobilita_pre ? 'Sì' : 'No'}
- 04_DISPONIBILITA_stretching_post: ${anamnesi.stretching_post ? 'Sì' : 'No'}
- 04_DISPONIBILITA_esercizi_preferiti: ${anamnesi.esercizi_preferiti || 'N/D'}
- 04_DISPONIBILITA_esercizi_evitare: ${anamnesi.esercizi_evitare || 'N/D'}

========== SALUTE ==========
- 05_SALUTE_dolori_attuali: ${anamnesi.presenza_dolori || 'N/D'}
- 05_SALUTE_descrizione_dolori: ${anamnesi.descrizione_dolori || 'N/D'}
- 05_SALUTE_infortuni: ${anamnesi.storia_infortuni || 'N/D'}
- 05_SALUTE_dettagli_infortuni: ${anamnesi.dettagli_infortuni || 'N/D'}
- 05_SALUTE_patologie: ${anamnesi.patologie || 'N/D'}
- 05_SALUTE_altre_patologie: ${anamnesi.altre_patologie || 'N/D'}
- 05_SALUTE_farmaci: ${anamnesi.farmaci || 'N/D'}

========== STILE DI VITA ==========
- 07_STILE_qualita_sonno: ${anamnesi.qualita_sonno || 'N/D'}/10
- 07_STILE_ore_sonno: ${anamnesi.ore_sonno || 'N/D'}
- 07_STILE_livello_stress: ${anamnesi.livello_stress || 'N/D'}/10

========== PREFERENZE ==========
- 07_PREFERENZE_focus_muscolare: ${anamnesi.focus_gruppi_muscolari || 'N/D'}

========== NOTE FINALI ==========
- 08_NOTE_informazioni_extra: ${anamnesi.note_aggiuntive || 'N/D'}
- 08_NOTE_domande: ${anamnesi.domande_trainer || 'N/D'}`;

  // Add bioimpedance data if available
  if (misurazione) {
    output += `

========== DATI BIOIMPEDENZIOMETRICI (ULTIMA MISURAZIONE) ==========
- Data misurazione: ${misurazione.data_misurazione || 'N/D'}
- Peso: ${misurazione.peso_kg || 'N/D'} kg
- Grasso corporeo: ${misurazione.grasso_percentuale || 'N/D'}%
- BMI: ${misurazione.bmi || 'N/D'}
- Muscolo scheletrico: ${misurazione.muscolo_scheletrico_percentuale || 'N/D'}%
- Massa muscolare: ${misurazione.massa_muscolare_kg || 'N/D'} kg
- Proteine: ${misurazione.proteine_percentuale || 'N/D'}%
- Metabolismo basale: ${misurazione.metabolismo_basale_kcal || 'N/D'} kcal
- Grasso viscerale: ${misurazione.grasso_viscerale_livello || 'N/D'}
- Idratazione: ${misurazione.idratazione_percentuale || 'N/D'}%
- Massa ossea: ${misurazione.massa_ossea_kg || 'N/D'} kg
- Età metabolica: ${misurazione.eta_metabolica || 'N/D'} anni`;
  }

  // Add returning client info if applicable
  if (anamnesi.tipo_cliente === 'Cliente_Ricorrente') {
    output += `

========== CLIENTE RICORRENTE ==========
- Conclusione ultimo programma: ${anamnesi.conclusione_ultimo_programma || 'N/D'}
- Durata programma precedente: ${anamnesi.durata_programma_precedente || 'N/D'}
- Efficacia programma precedente: ${anamnesi.efficacia_programma_voto || 'N/D'}/10
- Aspetti positivi: ${anamnesi.aspetti_positivi || 'N/D'}
- Modifiche desiderate: ${anamnesi.modifiche_desiderate || 'N/D'}
- Esercizi problematici: ${anamnesi.esercizi_problematici || 'N/D'}
- Risultati ottenuti: ${anamnesi.risultati_ottenuti || 'N/D'}
- Cambiamenti situazione: ${anamnesi.cambiamenti_situazione || 'N/D'}`;
  }

  return output;
}

// Continue conversation endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation_history, user_message } = body;

    if (!conversation_history || !user_message) {
      return NextResponse.json(
        { error: 'conversation_history e user_message sono obbligatori' },
        { status: 400 }
      );
    }

    // Add the new user message to history
    const messages = [
      ...conversation_history,
      { role: 'user', content: user_message }
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: messages,
    });

    const aiResponse = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    return NextResponse.json({
      success: true,
      risposta: aiResponse,
      conversation_history: [
        ...messages,
        { role: 'assistant', content: aiResponse }
      ],
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      }
    });

  } catch (error: any) {
    console.error('Error continuing conversation:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nella continuazione della conversazione' },
      { status: 500 }
    );
  }
}
